<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'admin_name',
        'action',
        'entity_type',
        'entity_id',
        'description',
        'ip_address',
        'user_agent',
    ];

    /**
     * Record an administrative activity log entry.
     */
    public static function record(
        string $action,
        string $description,
        ?string $entityType = null,
        $entityId = null,
        $admin = null,
        ?Request $request = null
    ): self {
        $req = $request ?: request();
        $ip = $req ? $req->ip() : null;
        $userAgent = $req ? substr($req->userAgent() ?? '', 0, 500) : null;

        $adminId = null;
        $adminName = 'System';

        if ($admin) {
            $adminId = $admin->id ?? null;
            $adminName = $admin->name ?? 'Admin';
        } elseif ($req && $req->user()) {
            $u = $req->user();
            $adminId = $u->id;
            $adminName = $u->name;
        }

        return self::create([
            'admin_id' => $adminId,
            'admin_name' => $adminName,
            'action' => strtoupper($action),
            'entity_type' => $entityType,
            'entity_id' => $entityId ? (string) $entityId : null,
            'description' => $description,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
        ]);
    }
}
