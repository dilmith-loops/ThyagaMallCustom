<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Admin;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Ensure default super admin exists in users table for unified display
        $defaultAdmin = Admin::where('email', 'admin@thyaga.lk')->first();
        if ($defaultAdmin) {
            User::firstOrCreate(
                ['email' => 'admin@thyaga.lk'],
                [
                    'name' => $defaultAdmin->name,
                    'phone' => '+94 70 685 0414',
                    'role' => 'super_admin',
                    'status' => 'active',
                    'password' => $defaultAdmin->password,
                    'last_login_at' => $defaultAdmin->last_login_at,
                ]
            );
        }

        $query = User::latest();

        if ($role = $request->query('role')) {
            if ($role === 'staff' || $role === 'admin') {
                $query->whereIn('role', ['super_admin', 'manager', 'editor']);
            } else {
                $query->where('role', $role);
            }
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15);

        // Append order count for each user
        $data = collect($users->items())->map(function ($u) {
            $orderCount = Order::where('customer_email', $u->email)->count();
            $userArray = $u->toArray();
            $userArray['orders_count'] = $orderCount;
            return $userArray;
        });

        // Summary statistics
        $stats = [
            'total_users' => User::count(),
            'total_admins' => User::whereIn('role', ['super_admin', 'manager', 'editor'])->count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'active_users' => User::where('status', 'active')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
            'stats' => $stats,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|unique:admins,email',
            'phone' => 'nullable|string|max:30',
            'role' => 'required|in:customer,super_admin,manager,editor',
            'status' => 'required|in:active,suspended,inactive',
            'password' => 'required|string|min:6',
        ]);

        $hashedPassword = Hash::make($validated['password']);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'status' => $validated['status'],
            'password' => $hashedPassword,
        ]);

        // If staff role, also create or sync Admin record
        if (in_array($validated['role'], ['super_admin', 'manager', 'editor'])) {
            Admin::updateOrCreate(
                ['email' => $validated['email']],
                [
                    'name' => $validated['name'],
                    'password' => $hashedPassword,
                    'role' => $validated['role'],
                    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($validated['name']) . '&background=36135d&color=fff',
                ]
            );
        }

        ActivityLog::record(
            'CREATE_USER',
            "Created new user '{$user->name}' with role " . strtoupper($user->role),
            'User',
            $user->id,
            $request->user(),
            $request
        );

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:30',
            'role' => 'sometimes|required|in:customer,super_admin,manager,editor',
            'status' => 'sometimes|required|in:active,suspended,inactive',
            'password' => 'nullable|string|min:6',
        ]);

        $updateData = [
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'phone' => array_key_exists('phone', $validated) ? $validated['phone'] : $user->phone,
            'role' => $validated['role'] ?? $user->role,
            'status' => $validated['status'] ?? $user->status,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        // Sync with Admin table if staff role
        if (in_array($user->role, ['super_admin', 'manager', 'editor'])) {
            $adminData = [
                'name' => $user->name,
                'role' => $user->role,
            ];
            if (!empty($validated['password'])) {
                $adminData['password'] = $updateData['password'];
            }
            Admin::updateOrCreate(['email' => $user->email], $adminData);
        } else {
            // If demoted from admin to customer, remove admin access
            Admin::where('email', $user->email)->delete();
        }

        ActivityLog::record(
            'UPDATE_USER',
            "Updated user '{$user->name}' (Role: " . strtoupper($user->role) . ", Status: " . strtoupper($user->status) . ")",
            'User',
            $user->id,
            $request->user(),
            $request
        );

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Protect primary admin from accidental deletion
        if ($user->email === 'admin@thyaga.lk') {
            return response()->json([
                'success' => false,
                'message' => 'Primary system administrator account cannot be deleted.',
            ], 403);
        }

        $userName = $user->name;
        $userEmail = $user->email;

        // Delete user and associated admin record if present
        $user->delete();
        Admin::where('email', $userEmail)->delete();

        ActivityLog::record(
            'DELETE_USER',
            "Deleted user '{$userName}' ({$userEmail})",
            'User',
            $id,
            $request->user(),
            $request
        );

        return response()->json([
            'success' => true,
            'message' => "User {$userName} removed successfully",
        ]);
    }
}
