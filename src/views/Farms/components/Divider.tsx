import styled from 'styled-components'

export default styled.hr`
  border-color: ${ ( { theme } ) => theme.colors.cardBorder };
  border-style: solid;
  border-width: 1px 0 0;
  margin: 4px 0;
`
