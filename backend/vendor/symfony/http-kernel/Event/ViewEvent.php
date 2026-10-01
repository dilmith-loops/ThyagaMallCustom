<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Symfony\Component\HttpKernel\Event;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * Allows to create a response for the return value of a controller.
 *
 * Call setResponse() to set the response that will be returned for the
 * current request. The propagation of this event is stopped as soon as a
 * response is set.
 *
 * @author Bernhard Schussek <bschussek@gmail.com>
 */
final class ViewEvent extends RequestEvent
{
    public readonly ?ControllerArgumentsMetadata $controllerMetadata;

    /**
     * @deprecated since Symfony 8.1, use $controllerMetadata instead
     */
    public ?ControllerArgumentsEvent $controllerArgumentsEvent = null;

    public function __construct(
        HttpKernelInterface $kernel,
        Request $request,
        int $requestType,
        private mixed $controllerResult,
        ControllerArgumentsMetadata|ControllerArgumentsEvent|null $controllerMetadata = null,
    ) {
        if ($controllerMetadata instanceof ControllerArgumentsEvent) {
            trigger_deprecation('symfony/http-kernel', '8.1', 'Passing a ControllerArgumentsEvent to the ViewEvent constructor is deprecated. Pass a ControllerArgumentsMetadata instance instead.');
            $this->controllerArgumentsEvent = $controllerMetadata;
            $controllerEvent = \Closure::bind(fn () => $this->controllerEvent, $controllerMetadata, ControllerArgumentsEvent::class)();
            $controllerMetadata = new ControllerArgumentsMetadata($controllerEvent, $controllerMetadata);
        }
        $this->controllerMetadata = $controllerMetadata;

        parent::__construct($kernel, $request, $requestType);
    }

    public function getControllerResult(): mixed
    {
        return $this->controllerResult;
    }

    public function setControllerResult(mixed $controllerResult): void
    {
        $this->controllerResult = $controllerResult;
    }
}
