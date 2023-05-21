export function SpacialNavigationWrapper({ children }: { children: React.JSX.Element }) {
  return <div>{children}</div>
}


const t = (
  <Wrapper>
    <Stage>
      <Block>
        <Focusable>
          <buttont>a</buttont>
        </Focusable>
        <Focusable>
          <buttont>b</buttont>
        </Focusable>
        <Focusable>
          <buttont>c</buttont>
        </Focusable>
      </Block>
      <Block>
        <Focusable>
          <buttont>a</buttont>
        </Focusable>
        <Focusable>
          <buttont>b</buttont>
        </Focusable>
        <Focusable>
          <buttont>c</buttont>
        </Focusable>
      </Block>
    </Stage>
  </Wrapper>
)
