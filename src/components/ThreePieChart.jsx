import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreePieChart = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const { labels, values, colors } = data;
    const total = values.reduce((acc, v) => acc + v, 0);

    const width = 400;
    const height = 400;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.3, 1000);
    camera.position.set(3, 2, 3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Pie Slices
    const meshes = [];
    let startAngle = 0;
    values.forEach((val, i) => {
      const angle = (val / total) * Math.PI * 2;

      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.arc(0, 0, 2, startAngle, startAngle + angle, false);
      shape.lineTo(0, 0);

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 1
      });

      const material = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        shininess: 80,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);
      meshes.push(mesh);

      startAngle += angle;
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      scene.rotation.y = t * 0.3;
      scene.rotation.x = 0.15 + 0.05 * Math.sin(t * 0.5);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
        scene.remove(mesh);
      });
      renderer.dispose();
    };
  }, [data]);

  return <div ref={containerRef} style={{ width: 400, height: 400 }} />;
};

export default ThreePieChart;
