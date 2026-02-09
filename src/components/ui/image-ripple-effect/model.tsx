// @ts-nocheck
import React, { useRef, useEffect, useState, useMemo, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useFBO, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { vertex, fragment } from './shaders';

interface ModelProps {
  imageUrl: string;
}

export default function Model({ imageUrl }: ModelProps) {
  const { viewport, size, pointer } = useThree();
  
  // Generate a procedural brush texture
  const [brushTexture] = useState(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'black';
      context.fillRect(0, 0, 32, 32);
      
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }); 

  const imageTexture = useTexture(imageUrl);
  
  // Brush System (Pure THREE objects, not R3F)
  const [brushSystem] = useState(() => {
    const scene = new THREE.Scene();
    const meshes = [];
    const max = 100;
    
    for (let i = 0; i < max; i++) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({ 
        map: brushTexture, 
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      mesh.rotation.z = Math.random() * Math.PI * 2;
      scene.add(mesh);
      meshes.push(mesh);
    }
    
    return { scene, meshes, currentWave: 0 };
  });

  const [prevMouse, setPrevMouse] = useState({ x: 0, y: 0 });

  const uniforms = useRef({
    uDisplacement: { value: null },
    uTexture: { value: null },
    winResolution: {
      value: new THREE.Vector2(0, 0),
    },
  });

  const fboBase = useFBO(size.width, size.height);
  const fboTexture = useFBO(size.width, size.height);

  // Setup Image Scene
  const { imageScene, imageCamera, imageMesh } = useMemo(() => { // Keeping useMemo for now, or change to useState?
    // Changing to useState requires destructuring in the next line.
    // Let's stick to valid changes.
    // If I change to useState, I need to make sure dependency array [imageTexture] is handled.
    // original useMemo had [imageTexture]. If imageTexture changes, we need to recreate?
    // Textures don't usually change instance often if URL is static.
    // If I use useState, I can't easily react to dependency changes without useEffect.
    // So sticking to useMemo for imageScene might be safer logic-wise, but I can check if I can silence the mutation error or fix it.
    // Actually, I'll update brushSystem first.
    // AND I will update imageScene to useMemo but suppress checking or accept that objects are mutable.
    // But wait, the error is `imageCamera.left = ...` in `useLayoutEffect`. 
    // That should be allowed.
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, 0, 10
    );
    camera.position.z = 2;
    scene.add(camera);
    
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: imageTexture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    return { imageScene: scene, imageCamera: camera, imageMesh: mesh };
  }, [imageTexture]);

  // Update Image Scene and Brushes on Viewport Change
  useLayoutEffect(() => {
    if (!imageMesh || !imageCamera) return;

    // Update Camera
    imageCamera.left = -viewport.width / 2;
    imageCamera.right = viewport.width / 2;
    imageCamera.top = viewport.height / 2;
    imageCamera.bottom = -viewport.height / 2;
    imageCamera.updateProjectionMatrix();

    // Update Image Scale (Cover Logic)
    const imageAspect = imageTexture.image ? imageTexture.image.width / imageTexture.image.height : 1;
    const viewportAspect = viewport.width / viewport.height;

    if (viewportAspect > imageAspect) {
      imageMesh.scale.x = viewport.width;
      imageMesh.scale.y = viewport.width / imageAspect;
    } else {
      imageMesh.scale.x = viewport.height * imageAspect;
      imageMesh.scale.y = viewport.height;
    }

    // Update Brush Size
    const brushSize = Math.min(viewport.width, viewport.height) * 0.15;
    brushSystem.meshes.forEach(mesh => {
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(brushSize, brushSize);
    });

  }, [viewport, imageTexture, imageMesh, imageCamera, brushSystem]);

  function setNewWave(x, y, index) {
    const mesh = brushSystem.meshes[index];
    if (mesh) {
      mesh.position.x = x;
      mesh.position.y = y;
      mesh.visible = true;
      mesh.material.opacity = 0.5; // Start with lower opacity for smoother effect
      mesh.scale.set(1, 1, 1);
    }
  }

  function trackMousePos(x, y) {
    if (Math.abs(x - prevMouse.x) > 0.1 || Math.abs(y - prevMouse.y) > 0.1) {
      brushSystem.currentWave = (brushSystem.currentWave + 1) % brushSystem.meshes.length;
      setNewWave(x, y, brushSystem.currentWave);
    }
    setPrevMouse({ x: x, y: y });
  }

  useFrame(({ gl, scene: finalScene }) => {
    const x = pointer.x * viewport.width / 2;
    const y = pointer.y * viewport.height / 2;
    
    trackMousePos(x, y);
    
    // Update brushes
    brushSystem.meshes.forEach((mesh) => {
      if (mesh.visible) {
        mesh.rotation.z += 0.02;
        mesh.material.opacity *= 0.96;
        mesh.scale.multiplyScalar(0.98);
        if (mesh.material.opacity < 0.01) mesh.visible = false;
      }
    });

    if (size.width > 0 && size.height > 0) {
      // 1. Draw Ripples to Base FBO
      gl.setRenderTarget(fboBase);
      gl.clear();
      gl.render(brushSystem.scene, imageCamera);

      // 2. Draw Image to Texture FBO
      gl.setRenderTarget(fboTexture);
      gl.render(imageScene, imageCamera);

      // 3. Draw Final Result to Screen
      gl.setRenderTarget(null);
      uniforms.current.uTexture.value = fboTexture.texture;
      uniforms.current.uDisplacement.value = fboBase.texture;
      uniforms.current.winResolution.value = new THREE.Vector2(
        size.width,
        size.height
      ).multiplyScalar(viewport.dpr || 1);
      
      gl.render(finalScene, imageCamera);
    }
  }, 1);

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent={true}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}
