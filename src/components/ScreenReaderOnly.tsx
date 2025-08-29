import { Box } from '@mui/material'
import type { BoxProps } from '@mui/material/Box'

interface ScreenReaderOnlyProps extends BoxProps {
  children: React.ReactNode
}

/**
 * スクリーンリーダーのみに表示されるコンポーネント
 * 視覚的には非表示だが、スクリーンリーダーには読み上げられる
 */
export const ScreenReaderOnly = ({ children, ...props }: ScreenReaderOnlyProps) => {
  return (
    <Box
      component="span"
      {...props}
      sx={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
        ...props.sx,
      }}
    >
      {children}
    </Box>
  )
}