import React, { useRef, useEffect } from 'react';
import { Canvas, extend, useFrame } from 'react-three-fiber';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Vector3 } from 'three';
import * as THREE from 'three';

extend({ PointerLockControls });

const Scene = () => {
  const controlsRef = useRef();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new Vector3());
  const direction = new Vector3();
  const clock = useRef(new THREE.Clock());

  const handleMouseMove = (e) => {
    if (document.pointerLockElement === document.body) {
      const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      controlsRef.current.getObject().rotation.y -= movementX * 0.002;
      controlsRef.current.getObject().rotation.x -= movementY * 0.002;
    }
  };

  useFrame(() => {
    controlsRef.current.update();
  });
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'w' || e.key === 'ArrowUp') {
        moveForward.current = true;
      } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        moveLeft.current = true;
      } else if (e.key === 's' || e.key === 'ArrowDown') {
        moveBackward.current = true;
      } else if (e.key === 'd' || e.key === 'ArrowRight') {
        moveRight.current = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'w' || e.key === 'ArrowUp') {
        moveForward.current = false;
      } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        moveLeft.current = false;
      } else if (e.key === 's' || e.key === 'ArrowDown') {
        moveBackward.current = false;
      } else if (e.key === 'd' || e.key === 'ArrowRight') {
        moveRight.current = false;
      }
    };

    const handleMouseMove = (e) => {
      if (document.pointerLockElement === document.body) {
        const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

        controlsRef.current.getObject().rotation.y -= movementX * 0.002;
        controlsRef.current.getObject().rotation.x -= movementY * 0.002;
      }
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === document.body) {
        document.addEventListener('keydown', handleKeyDown, false);
        document.addEventListener('keyup', handleKeyUp, false);
      } else {
        document.removeEventListener('keydown', handleKeyDown, false);
        document.removeEventListener('keyup', handleKeyUp, false);
        moveForward.current = false;
        moveBackward.current = false;
        moveLeft.current = false;
        moveRight.current = false;
      }
    };

    const handlePointerLockError = () => {
      console.error('Pointer lock error.');
    };

    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('pointerlockchange', handlePointerLockChange, false);
    document.addEventListener('pointerlockerror', handlePointerLockError, false);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, false);
      document.removeEventListener('pointerlockchange', handlePointerLockChange, false);
      document.removeEventListener('pointerlockerror', handlePointerLockError, false);
    };
  }, []);

  useFrame(() => {
    const delta = clock.current.getDelta();
    velocity.current.x -= velocity.current.x * 10.0 * delta;
    velocity.current.z -= velocity.current.z * 10.0 * delta;

    direction.z = Number(moveForward.current) - Number(moveBackward.current);
    direction.x = Number(moveRight.current) - Number(moveLeft.current);
    direction.normalize();

    if (moveForward.current || moveBackward.current) {
      velocity.current.z -= direction.z * 400.0 * delta;
    }

    if (moveLeft.current || moveRight.current) {
      velocity.current.x -= direction.x * 400.0 * delta;
    }

    controlsRef.current.moveRight(-velocity.current.x * delta);
    controlsRef.current.moveForward(-velocity.current.z * delta);

    controlsRef.current.getObject().position.y = 1.8;

    controlsRef.current.update();
  });

  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      onMouseMove={handleMouseMove}
      onClick={() => {
        controlsRef.current.lock();
      }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <PointerLockControls ref={controlsRef} />
      {/* Add your 3D scene elements here */}
    </Canvas>
  );
};

export default Scene;
