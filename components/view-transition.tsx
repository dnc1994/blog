export function ViewTransition({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div style={{ viewTransitionName: 'crossfade' }}>
      {children}
    </div>
  )
}

