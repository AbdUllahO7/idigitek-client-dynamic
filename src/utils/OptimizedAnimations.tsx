import { useOptimizedIntersection } from '@/hooks/useIntersectionObserver';
import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { JSX } from 'react';

interface OptimizedFadeInProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  triggerOnce?: boolean
  threshold?: number
  style?: React.CSSProperties
  as?: keyof JSX.IntrinsicElements
}

// CSS Classes للتحريك - يتم إنشاؤها مرة واحدة
const createAnimationStyles = () => {
  const styleId = 'optimized-animations'
  
  if (document.getElementById(styleId)) return

  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    .fade-enter {
      opacity: 0;
      transform: var(--initial-transform, translateY(20px));
      transition: opacity var(--duration, 600ms) ease-out var(--delay, 0ms), 
                  transform var(--duration, 600ms) ease-out var(--delay, 0ms);
      will-change: opacity, transform;
    }
    
    .fade-enter-active {
      opacity: 1;
      transform: translateY(0) translateX(0) scale(1);
    }
    
    .fade-enter-done {
      opacity: 1;
      transform: translateY(0) translateX(0) scale(1);
      will-change: auto;
    }

    /* تحسينات للأداء */
    .fade-container {
      contain: layout style paint;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .fade-enter {
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
      }
    }

    /* تحسين للشاشات الصغيرة */
    @media (max-width: 768px) {
      .fade-enter {
        --duration: 400ms;
        --delay: 0ms;
      }
    }
  `
  
  document.head.appendChild(style)
}

export const OptimizedFadeIn = forwardRef<HTMLElement, OptimizedFadeInProps>(({
  children,
  className = '',
  duration = 600,
  delay = 0,
  direction = 'up',
  distance = 20,
  triggerOnce = true,
  threshold = 0.1,
  style = {},
  as: Component = 'div'
}, forwardedRef) => {
  const { ref, isInView } = useOptimizedIntersection({
    threshold,
    triggerOnce,
    rootMargin: '50px'
  })
  
  const [animationState, setAnimationState] = useState<'enter' | 'enter-active' | 'enter-done'>('enter')
  const elementRef = useRef<HTMLElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout>(null)

  useEffect(() => {
    createAnimationStyles()
  }, [])

  useEffect(() => {
    if (isInView && animationState === 'enter') {
      const timer = setTimeout(() => {
        setAnimationState('enter-active')
        
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationState('enter-done')
        }, duration + delay)
        
      }, 10) 
      
      return () => clearTimeout(timer)
    }
  }, [isInView, animationState, duration, delay])

  // تنظيف التايمرز
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`
      case 'down':
        return `translateY(-${distance}px)`
      case 'left':
        return `translateX(${distance}px)`
      case 'right':
        return `translateX(-${distance}px)`
      case 'none':
      default:
        return 'none'
    }
  }

  // دمج الـ refs
  const combinedRef = (node: HTMLElement | null) => {
    if (node) {
      ref.current = node
      elementRef.current = node
      
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else {
          forwardedRef.current = node
        }
      }
    }
  }

  const animationStyle: React.CSSProperties = {
    '--duration': `${duration}ms`,
    '--delay': `${delay}ms`,
    '--initial-transform': getInitialTransform(),
    ...style
  } as React.CSSProperties

  const combinedClassName = [
    'fade-container',
    `fade-${animationState}`,
    className
  ].filter(Boolean).join(' ')

  return React.createElement(
    Component,
    {
      ref: combinedRef,
      className: combinedClassName,
      style: animationStyle,
      'data-animation-state': animationState
    },
    children
  )
})

OptimizedFadeIn.displayName = 'OptimizedFadeIn'

// مكونات مخصصة للاستخدامات الشائعة
export const FadeInUp: React.FC<Omit<OptimizedFadeInProps, 'direction'>> = (props) => (
  <OptimizedFadeIn {...props} direction="up" />
)

export const FadeInDown: React.FC<Omit<OptimizedFadeInProps, 'direction'>> = (props) => (
  <OptimizedFadeIn {...props} direction="down" />
)

export const FadeInLeft: React.FC<Omit<OptimizedFadeInProps, 'direction'>> = (props) => (
  <OptimizedFadeIn {...props} direction="left" />
)

export const FadeInRight: React.FC<Omit<OptimizedFadeInProps, 'direction'>> = (props) => (
  <OptimizedFadeIn {...props} direction="right" />
)

// مكون مبسّط للتوافق مع الكود الحالي
export const FadeIn: React.FC<OptimizedFadeInProps> = (props) => (
  <OptimizedFadeIn {...props} />
)

// Hook للتحكم المباشر في CSS animations
export const useOptimizedAnimation = (
  trigger: boolean,
  options: {
    duration?: number
    delay?: number
    easing?: string
  } = {}
) => {
  const { duration = 600, delay = 0, easing = 'ease-out' } = options
  const elementRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (trigger) {
      element.style.transition = `all ${duration}ms ${easing} ${delay}ms`
      element.style.opacity = '1'
      element.style.transform = 'translateY(0) translateX(0) scale(1)'
    } else {
      element.style.opacity = '0'
      element.style.transform = 'translateY(20px)'
    }
  }, [trigger, duration, delay, easing])

  return elementRef
}