import React, { useState, useEffect } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  // Use fixed height and flexible width so the image keeps its aspect ratio.
  const heightClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-14',
    xl: 'h-20'
  };

  const widthClasses = {
    sm: 'w-8',
    md: 'w-12',
    lg: 'w-14',
    xl: 'w-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const [src, setSrc] = useState('/PassionProjectBuilderAppLogo.jpg');

  useEffect(() => {
    // Perform a lightweight HEAD request to confirm the JPG looks like a real image
    // (content-type starts with image/ and content-length is > 200 bytes).
    // If it doesn't look valid, immediately switch to the fallback SVG so users see a logo.
    let mounted = true;
    async function validate() {
      try {
        const resp = await fetch('/PassionProjectBuilderAppLogo.jpg', { method: 'HEAD' });
        if (!mounted) return;
        const contentType = resp.headers.get('content-type') || '';
        const contentLength = parseInt(resp.headers.get('content-length') || '0', 10) || 0;
        if (!contentType.startsWith('image/') || contentLength < 200) {
          setSrc('/file.svg');
        }
      } catch (err) {
        if (mounted) setSrc('/file.svg');
      }
    }
    validate();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex items-center space-x-3">
      {/* Logo holder: fixed height, flexible width; allow filling more space for xl */}
      <div className={`${heightClasses[size]} ${widthClasses[size]} rounded-lg flex items-center justify-center shadow-lg overflow-hidden bg-white`}>
        <img
          src={src}
          alt="Passion Project Builder"
          className="h-full w-full object-contain"
          onError={() => {
            // If the JPG fails to load (corrupt/placeholder), fall back to an existing SVG in public/
            if (src !== '/file.svg') setSrc('/file.svg');
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-gray-900 ${textSizes[size]}`}>
            Passion Project Builder
          </span>
        </div>
      )}
    </div>
  );
} 