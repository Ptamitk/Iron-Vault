import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ProductExperience.css'

gsap.registerPlugin(ScrollTrigger)

function makeLabelTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 1024, 0)
  gradient.addColorStop(0, '#171914')
  gradient.addColorStop(0.5, '#34382d')
  gradient.addColorStop(1, '#141611')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1024, 1024)
  ctx.fillStyle = '#b5c49a'
  ctx.fillRect(70, 105, 884, 5)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#f3f0e8'
  ctx.font = '800 142px Arial'
  ctx.fillText('IRON VAULT', 512, 330)
  ctx.fillStyle = '#b5c49a'
  ctx.fillRect(160, 385, 704, 4)
  ctx.fillStyle = '#f3f0e8'
  ctx.font = '700 104px Arial'
  ctx.fillText('WHEY PROTEIN', 512, 555)
  ctx.font = '500 34px Arial'
  ctx.fillStyle = '#d0d0c4'
  ctx.fillText('DARK COCOA  /  PREMIUM BLEND', 512, 630)
  ctx.fillStyle = '#b5c49a'
  ctx.font = '700 48px Arial'
  ctx.fillText('24G PROTEIN     •     01 KG', 512, 825)
  ctx.fillRect(70, 890, 884, 5)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function ProductExperience() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!section || !stage || !canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25

    scene.add(new THREE.HemisphereLight(0xe8f0d8, 0x171914, 2.1))
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4)
    keyLight.position.set(4, 5, 6)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0xb5c49a, 24, 14)
    rimLight.position.set(-4, 1, -2)
    scene.add(rimLight)

    const product = new THREE.Group()
    const productModel = new THREE.Group()
    product.add(productModel)
    scene.add(product)

    const label = makeLabelTexture()
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 0.94, 2.75, 96, 1, false),
      new THREE.MeshStandardMaterial({ map: label, metalness: 0.18, roughness: 0.42 }),
    )
    body.position.y = -0.08
    productModel.add(body)

    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(1.045, 1.045, 0.25, 96),
      new THREE.MeshStandardMaterial({ color: 0x34372f, metalness: 0.72, roughness: 0.28 }),
    )
    lid.position.y = 1.43
    productModel.add(lid)

    const lidRim = new THREE.Mesh(
      new THREE.CylinderGeometry(1.055, 1.055, 0.055, 96),
      new THREE.MeshStandardMaterial({ color: 0x9a9c89, metalness: 0.8, roughness: 0.22 }),
    )
    lidRim.position.y = 1.30
    productModel.add(lidRim)

    const bottom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.08, 96),
      new THREE.MeshStandardMaterial({ color: 0x171914, metalness: 0.25, roughness: 0.55 }),
    )
    bottom.position.y = -1.48
    productModel.add(bottom)

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.15, 64),
      new THREE.MeshBasicMaterial({ color: 0xb5c49a, transparent: true, opacity: 0.075, side: THREE.DoubleSide }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -1.58
    productModel.add(floor)

    const resize = () => {
      const width = stage.clientWidth
      const height = stage.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.position.z = width < 700 ? 10.5 : 9
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(stage)

    // Hover animation is applied to the model inside the scroll-driven group,
    // so pointer movement never fights the ScrollTrigger rotation.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const tiltX = gsap.quickTo(productModel.rotation, 'x', { duration: 0.55, ease: 'power3.out' })
    const tiltY = gsap.quickTo(productModel.rotation, 'y', { duration: 0.7, ease: 'power3.out' })
    const tiltZ = gsap.quickTo(productModel.rotation, 'z', { duration: 0.6, ease: 'power3.out' })
    const scaleX = gsap.quickTo(productModel.scale, 'x', { duration: 0.55, ease: 'power3.out' })
    const scaleY = gsap.quickTo(productModel.scale, 'y', { duration: 0.55, ease: 'power3.out' })
    const scaleZ = gsap.quickTo(productModel.scale, 'z', { duration: 0.55, ease: 'power3.out' })
    const lightX = gsap.quickTo(keyLight.position, 'x', { duration: 0.6, ease: 'power2.out' })
    const lightY = gsap.quickTo(keyLight.position, 'y', { duration: 0.6, ease: 'power2.out' })
    const rimPower = gsap.quickTo(rimLight, 'intensity', { duration: 0.5, ease: 'power2.out' })
    const onPointerMove = (event) => {
      const rect = stage.getBoundingClientRect()
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1
      tiltX(-ny * 0.2)
      tiltY(nx * 0.34)
      tiltZ(-nx * 0.055)
      scaleX(1.075)
      scaleY(1.075)
      scaleZ(1.075)
      lightX(4 + nx * 2.8)
      lightY(5 - ny * 2.2)
      rimPower(34)
      stage.classList.add('is-product-hovered')
      stage.style.setProperty('--hover-x', `${(nx + 1) * 50}%`)
      stage.style.setProperty('--hover-y', `${(ny + 1) * 50}%`)
    }
    const onPointerLeave = () => {
      tiltX(0)
      tiltY(0)
      tiltZ(0)
      scaleX(1)
      scaleY(1)
      scaleZ(1)
      lightX(4)
      lightY(5)
      rimPower(24)
      stage.classList.remove('is-product-hovered')
    }
    if (canHover) {
      stage.addEventListener('pointermove', onPointerMove)
      stage.addEventListener('pointerleave', onPointerLeave)
    }

    let frame
    const render = () => {
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }
    render()

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const mobile = window.matchMedia('(max-width: 700px)').matches
      gsap.set(product.position, { x: mobile ? 0 : 2.2, y: mobile ? -1.45 : 0 })
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=2100',
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      timeline
        .to(product.rotation, { y: Math.PI * 1.05, x: 0.12, z: -0.08, ease: 'none' }, 0)
        .to(product.position, { x: mobile ? 0 : 2.05, y: mobile ? -1.5 : -0.08, ease: 'none' }, 0)
        .to(product.scale, { x: 1.12, y: 1.12, z: 1.12, ease: 'none' }, 0.12)
        .to('.experience-panel-one', { autoAlpha: 0, y: -24, duration: 0.12, ease: 'power1.in' }, 0.27)
        .fromTo('.experience-panel-two', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: 'power1.out', immediateRender: false }, 0.42)
        .to(product.rotation, { y: Math.PI * 1.95, x: -0.08, ease: 'none' }, 0.48)
        .to(product.position, { x: mobile ? 0 : 1.75, y: mobile ? -1.12 : 0.05, ease: 'none' }, 0.48)
        .to('.experience-panel-two', { autoAlpha: 0, y: -24, duration: 0.12, ease: 'power1.in' }, 0.67)
        .fromTo('.experience-panel-three', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: 'power1.out', immediateRender: false }, 0.82)
        .to(product.rotation, { y: Math.PI * 2, x: 0, z: 0, ease: 'none' }, 0.76)
        .to(product.scale, { x: 1, y: 1, z: 1, ease: 'none' }, 0.82)
    })

    return () => {
      mm.revert()
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerleave', onPointerLeave)
      observer.disconnect()
      cancelAnimationFrame(frame)
      body.geometry.dispose()
      body.material.dispose()
      lid.geometry.dispose()
      lid.material.dispose()
      lidRim.geometry.dispose()
      lidRim.material.dispose()
      bottom.geometry.dispose()
      bottom.material.dispose()
      floor.geometry.dispose()
      floor.material.dispose()
      label.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <section className="product-experience" ref={sectionRef} aria-label="Three dimensional Iron Vault product story">
      <div className="experience-stage" ref={stageRef}>
        <canvas className="experience-canvas" ref={canvasRef} aria-label="Interactive three dimensional whey protein tub" />
        <div className="experience-topline"><span>IRON VAULT / OBJECT 001</span><span>SCROLL-DRIVEN PRODUCT FILM</span></div>
        <div className="experience-panels">
          <article className="experience-panel experience-panel-one"><span>01 — THE FORMULA</span><h2>BUILT FOR<br /><em>THE DAILY.</em></h2><p>Purposeful performance, designed around your everyday training ritual.</p></article>
          <article className="experience-panel experience-panel-two"><span>02 — THE FOCUS</span><h2>NO NOISE.<br /><em>JUST FOCUS.</em></h2><p>Keep your attention on the work. Let consistency do the talking.</p></article>
          <article className="experience-panel experience-panel-three"><span>03 — THE STANDARD</span><h2>MAKE EVERY<br /><em>REP COUNT.</em></h2><p>Your routine. Your effort. Your next level starts with showing up.</p></article>
        </div>
        <div className="experience-bottomline"><span>SCROLL TO EXPLORE ↓</span><span>FORM FOLLOWS FUNCTION</span></div>
      </div>
    </section>
  )
}
