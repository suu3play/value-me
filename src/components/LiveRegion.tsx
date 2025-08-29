import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'

interface LiveRegionProps {
  message: string
  priority?: 'polite' | 'assertive'
  clearDelay?: number
}

/**
 * スクリーンリーダー向けのライブリージョンコンポーネント
 * メッセージの変更を動的に通知する
 */
export const LiveRegion = ({ 
  message, 
  priority = 'polite', 
  clearDelay = 1000 
}: LiveRegionProps) => {
  const previousMessage = useRef<string>('')
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // メッセージが変更された場合のみ処理
    if (message !== previousMessage.current && message.trim() !== '') {
      previousMessage.current = message

      // 既存のタイマーをクリア
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 指定した時間後にメッセージをクリア
      if (clearDelay > 0) {
        timeoutRef.current = setTimeout(() => {
          previousMessage.current = ''
        }, clearDelay)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [message, clearDelay])

  if (!message.trim()) {
    return null
  }

  return (
    <Box
      component="div"
      role="status"
      aria-live={priority}
      aria-atomic="true"
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
      }}
    >
      {message}
    </Box>
  )
}