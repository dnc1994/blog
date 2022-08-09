import link from './link'

const Item = ({ name, path, active }) => {
  if (!active) {
    return <link.a href={path} prefetch>{name}</link.a>
  }
  return <span>{name}</span>
}

export default ({ url }) => <div className='navigation'>
  <Item name='POSTS' path='/posts' active={url === '/posts'}/>
  <Item name='NOTES' path='/notes' active={url === '/notes'}/>
  <Item name='TAGS' path='/tags' active={url === '/tags'}/>
  <Item name='ABOUT' path='/' active={url === '/'}/>

  <style jsx>{`
    .navigation {
      display: flex;
      justify-content: flex-end;
      margin: 3rem -.5rem 1rem;
    }
    .navigation :global(span) {
      color: #999;
      cursor: default;
    }
    .navigation :global(a), .navigation :global(span) {
      margin: 0 .5rem;
    }
    .webring: {
      line-height: 1
      display: inline-block
    }
  `}</style>
</div>
