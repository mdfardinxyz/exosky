import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

window.addEventListener("DOMContentLoaded", async () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    const fov = 75;
    const aspect = w / h;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 3;

    const scene = new THREE.Scene();

    new OrbitControls(camera, renderer.domElement);

    const loader = new THREE.TextureLoader();

    const earthMapTexture = "/assets/earth-textures/earthmap1k.jpg";
    const earthCloudMapTexture =
        "/assets/earth-textures/earthcloudmaptrans.jpg";
    const earthBumpTexture = "/assets/earth-textures/earthbump1k.jpg";
    const earthLightTexture = "/assets/earth-textures/earthlights1k.jpg";

    // earth
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);

    const geometry = new THREE.IcosahedronGeometry(1, 12);
    const material = new THREE.MeshStandardMaterial({
        map: loader.load(earthMapTexture),
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    const lightMat = new THREE.MeshBasicMaterial({
        map: loader.load(earthLightTexture),
        blending: THREE.AdditiveBlending,
    });
    const lightMesh = new THREE.Mesh(geometry, lightMat);
    earthGroup.add(lightMesh);

    const cloudMat = new THREE.MeshStandardMaterial({
        map: loader.load(earthCloudMapTexture),
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(geometry, cloudMat);
    cloudMesh.scale.setScalar(1.003);
    earthGroup.add(cloudMesh);

    const bumpMat = new THREE.MeshStandardMaterial({
        map: loader.load(earthBumpTexture),
        blending: THREE.AdditiveBlending,
    });
    const bumpMesh = new THREE.Mesh(geometry, bumpMat);
    bumpMesh.scale.setScalar(1.005);
    earthGroup.add(bumpMesh);

    // stars
    const starGeometry = new THREE.BufferGeometry();
    const records = await fetch("http://127.0.0.1:8080").then((res) =>
        res.json()
    );
    const starVertices = new Float32Array(records.length * 3);
    for (let i = 0; i < records.length; i++) {
        const stIdx = i * 3;
        starVertices[stIdx] = records[i]["xp"];
        starVertices[stIdx + 1] = records[i]["yp"];
        starVertices[stIdx + 2] = records[i]["zp"];
    }
    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starVertices, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        sizeAttenuation: true,
        map: loader.load("/assets/earth-textures/circle.png"),
        transparent: true,
    });
    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(-3, 0.5, 1.5);
    scene.add(sunLight);

    // animation
    function animate(t = 0) {
        requestAnimationFrame(animate);
        earthMesh.rotation.y += 0.002;
        lightMesh.rotation.y += 0.002;
        cloudMesh.rotation.y += 0.0025;
        bumpMesh.rotation.y += 0.002;

        starMesh.rotation.x += 0.0001;
        starMesh.rotation.y += 0.0001;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
});
