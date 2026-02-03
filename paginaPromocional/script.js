document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar & Mobile Menu Logic (Preserved) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '1rem 5%';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1.5rem 5%';
        }
    });

    // --- Modular Three.js Scenes ---
    if (typeof THREE !== 'undefined') {
        const scenes = [];

        // Scene Factory Function
        const create3DScene = (containerId, type, colorHex) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const scene = new THREE.Scene();
            // Fog matches background color roughly to fade out
            const fogColor = (type === 'CORE') ? 0x000000 : (type === 'WAVES' ? 0x050510 : 0x001010);
            scene.fog = new THREE.FogExp2(fogColor, 0.002);

            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 30;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            const group = new THREE.Group();
            scene.add(group);

            // --- Type Specific Logic ---
            let animateType;

            if (type === 'CORE') {
                // 1. Organizational Hierarchy Tree (HR Representation)

                // Helper to create glowing nodes
                const createNode = (size, color) => {
                    const geometry = new THREE.SphereGeometry(size, 16, 16);
                    const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
                    return new THREE.Mesh(geometry, material);
                };

                // Center Node (Coordinator)
                const centerNode = createNode(1.5, 0xffffff); // White center
                group.add(centerNode);

                const nodes = [];
                const linesGeometry = new THREE.BufferGeometry();
                const linePositions = [];

                // Layer 1: Leaders (Orbiting center)
                const leaderCount = 6;
                const leaderRadius = 10;

                for (let i = 0; i < leaderCount; i++) {
                    const angle = (i / leaderCount) * Math.PI * 2;
                    const leader = createNode(0.8, colorHex); // Brand Color

                    leader.position.x = Math.cos(angle) * leaderRadius;
                    leader.position.y = Math.sin(angle) * leaderRadius;
                    leader.position.z = 0;

                    group.add(leader);
                    nodes.push({ mesh: leader, speed: 0.01, offset: i });

                    // Connection Center -> Leader
                    linePositions.push(0, 0, 0);
                    linePositions.push(leader.position.x, leader.position.y, leader.position.z);

                    // Layer 2: Members (Clustered around Leaders)
                    const memberCount = 4;
                    const memberRadius = 4;

                    for (let j = 0; j < memberCount; j++) {
                        const mAngle = (j / memberCount) * Math.PI * 2;
                        const member = createNode(0.3, 0xffaaaa); // Lighter Red

                        // Relative position to leader
                        const mx = Math.cos(mAngle) * memberRadius;
                        const my = Math.sin(mAngle) * memberRadius;
                        const mz = (Math.random() - 0.5) * 4; // Add some depth randomness

                        member.userData = { parent: leader, relX: mx, relY: my, relZ: mz, angle: mAngle };

                        // Initial global pos (for line drawing init)
                        member.position.set(leader.position.x + mx, leader.position.y + my, leader.position.z + mz);

                        group.add(member);
                        nodes.push({ mesh: member, type: 'member', speed: 0.02 });

                        // Connection Leader -> Member
                        // We will update these dynamically in animate
                    }
                }

                // Create Lines Mesh
                // Note: We need dynamic buffer updates for lines as nodes move
                const maxPoints = 500;
                linesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxPoints * 3), 3));
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: colorHex,
                    transparent: true,
                    opacity: 0.3
                });
                const connections = new THREE.LineSegments(linesGeometry, lineMaterial);
                group.add(connections);

                animateType = () => {
                    // Rotate the whole system slightly
                    group.rotation.y += 0.002;

                    const positions = connections.geometry.attributes.position.array;
                    let posIndex = 0;

                    // Update Leaders and Members
                    // We iterate through group children to find hierarchy logic if needed, 
                    // but simpler to rebuild line buffer based on known structure

                    // Re-calculate lines
                    // Center -> Leaders
                    // Leaders -> Members

                    // We need to access the specific meshes we created. 
                    // Let's filter distinct sets from the 'nodes' array we populated or just traverse

                    // Optimized: Iterate our tracked 'nodes' array
                    // However, we need to know relationships.
                    // Let's reconstruct based on the loop logic structure

                    // Actually, simpler approach for visual only:
                    // 1. Center holds still (0,0,0) relative to group.
                    // 2. Leaders are children of group, we just rotate them? 
                    // No, we want them to orbit.

                    // Let's just create a quick visual update loop
                    // Center is static (0,0,0) in group space.

                    // Update connections buffer
                    // ... This is getting complex to track index.
                    // Let's simplify: Static Relative Positions, Group Rotation only.
                    // If we just rotate the group, the hierarchy stays rigid, which is fine for a "structure" visualization.
                    // To make it alive, let's rotate the 'Members' around their 'Leader' parents.
                };

                // Refined Logic for Animation Loop support
                // We'll store members to animate them specifically
                const members = nodes.filter(n => n.type === 'member');

                animateType = () => {
                    group.rotation.z += 0.001; // Entire tree rotates
                    group.rotation.y += 0.002;

                    let posIndex = 0;
                    const positions = connections.geometry.attributes.position.array;

                    // Update Member positions (orbit parents)
                    members.forEach(m => {
                        const parent = m.mesh.userData.parent;
                        m.mesh.userData.angle += 0.02; // Orbit speed
                        const r = 4; // Radius

                        // Update position relative to parent
                        m.mesh.position.x = parent.position.x + Math.cos(m.mesh.userData.angle) * r;
                        m.mesh.position.y = parent.position.y + Math.sin(m.mesh.userData.angle) * r;
                        m.mesh.position.z = parent.position.z + Math.sin(m.mesh.userData.angle) * 1; // Slight Z wobble
                    });

                    // Rebuild Lines
                    // 1. Center (0,0,0) to Leaders
                    group.children.forEach(child => {
                        // Identify Leaders (radius approx 10)
                        const dist = child.position.length();
                        if (Math.abs(dist - 10) < 0.1) {
                            // Link Center -> Leader
                            positions[posIndex++] = 0; positions[posIndex++] = 0; positions[posIndex++] = 0;
                            positions[posIndex++] = child.position.x; positions[posIndex++] = child.position.y; positions[posIndex++] = child.position.z;
                        }

                        // Identify Members and link to their Parent
                        if (child.userData.parent) {
                            const p = child.userData.parent;
                            positions[posIndex++] = p.position.x; positions[posIndex++] = p.position.y; positions[posIndex++] = p.position.z;
                            positions[posIndex++] = child.position.x; positions[posIndex++] = child.position.y; positions[posIndex++] = child.position.z;
                        }
                    });

                    connections.geometry.setDrawRange(0, posIndex / 3);
                    connections.geometry.attributes.position.needsUpdate = true;
                };

            } else if (type === 'WAVES') {
                // 2. Data Waves (Analytics)
                const geometry = new THREE.BufferGeometry();
                const count = 50;
                const positions = new Float32Array(count * count * 3);
                let i = 0;
                for (let x = 0; x < count; x++) {
                    for (let z = 0; z < count; z++) {
                        positions[i * 3] = (x - count / 2) * 1.5;
                        positions[i * 3 + 1] = 0;
                        positions[i * 3 + 2] = (z - count / 2) * 1.5;
                        i++;
                    }
                }
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                const material = new THREE.PointsMaterial({
                    color: colorHex, size: 0.2, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
                });
                const particles = new THREE.Points(geometry, material);
                group.add(particles);
                group.rotation.x = -Math.PI / 4; // Tilt

                let time = 0;
                animateType = () => {
                    time += 0.05;
                    const positions = particles.geometry.attributes.position.array;
                    let i = 0;
                    for (let x = 0; x < count; x++) {
                        for (let z = 0; z < count; z++) {
                            const y = Math.sin(x * 0.3 + time) * 2 + Math.cos(z * 0.2 + time) * 2;
                            positions[i * 3 + 1] = y;
                            i++;
                        }
                    }
                    particles.geometry.attributes.position.needsUpdate = true;
                };

            } else if (type === 'SHIELD') {
                // 3. Security Shield
                const outerGeo = new THREE.IcosahedronGeometry(10, 2);
                const outerMat = new THREE.MeshBasicMaterial({
                    color: colorHex, wireframe: true, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending
                });
                const outerSphere = new THREE.Mesh(outerGeo, outerMat);
                group.add(outerSphere);

                const innerGeo = new THREE.IcosahedronGeometry(6, 0);
                const innerMat = new THREE.MeshBasicMaterial({
                    color: 0xffffff, wireframe: true, transparent: true, opacity: 0.2
                });
                const innerSphere = new THREE.Mesh(innerGeo, innerMat);
                group.add(innerSphere);

                animateType = () => {
                    outerSphere.rotation.y += 0.002;
                    outerSphere.rotation.z += 0.001;
                    innerSphere.rotation.y -= 0.005;
                    innerSphere.rotation.x += 0.002;
                };
            }

            // Universal Interaction
            scenes.push({
                renderer, scene, camera, group, animateType, container
            });
        };

        // Create Scenes
        create3DScene('canvas-container', 'CORE', 0xee3a43);
        create3DScene('canvas-container-analytics', 'WAVES', 0x818cf8);
        create3DScene('canvas-container-security', 'SHIELD', 0x2dd4bf);

        // Global Mouse
        let globalMouseX = 0;
        let globalMouseY = 0;
        document.addEventListener('mousemove', (event) => {
            globalMouseX = (event.clientX - window.innerWidth / 2) * 0.001;
            globalMouseY = (event.clientY - window.innerHeight / 2) * 0.001;
        });

        // Global Animation Loop
        const globalAnimate = () => {
            requestAnimationFrame(globalAnimate);

            scenes.forEach(s => {
                const rect = s.container.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) return;

                if (s.animateType) s.animateType();

                // Interactive tilt
                s.group.rotation.x += (globalMouseY - s.group.rotation.x) * 0.05;
                s.group.rotation.y += (globalMouseX - s.group.rotation.y) * 0.05;

                s.renderer.render(s.scene, s.camera);
            });
        };

        globalAnimate();

        // Handle Resize
        window.addEventListener('resize', () => {
            scenes.forEach(s => {
                s.camera.aspect = s.container.clientWidth / s.container.clientHeight;
                s.camera.updateProjectionMatrix();
                s.renderer.setSize(s.container.clientWidth, s.container.clientHeight);
            });
        });
    }
});
