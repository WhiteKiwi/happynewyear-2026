import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function LetterView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [letterData, setLetterData] = useState(null)
  const [isOpened, setIsOpened] = useState(false)
  const [animationStep, setAnimationStep] = useState(0) // 0: 봉투, 1: 봉투 열림, 2: 편지 튀어나옴, 3: 편지 펼침
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // URL에서 f 파라미터 가져오기
    const encodedData = searchParams.get('f')

    if (encodedData) {
      try {
        // base64url 디코딩 (URL safe, 하위 호환성 지원)
        let base64 = encodedData
          .replace(/\./g, '+')  // . → + (새로운 방식)
          .replace(/-/g, '+')   // - → + (기존 링크 호환)
          .replace(/_/g, '/')   // _ → /

        // 패딩 복원
        while (base64.length % 4) {
          base64 += '='
        }

        const jsonString = decodeURIComponent(escape(atob(base64)))
        const data = JSON.parse(jsonString)
        setLetterData(data)
      } catch (error) {
        console.error('Failed to decode letter data:', error)
      }
    }
  }, [searchParams])

  const handleEnvelopeClick = () => {
    if (!isOpened) {
      setIsOpened(true)
      // 음악 재생
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err))
        setIsMusicPlaying(true)
      }
      // 애니메이션 단계별 진행
      setTimeout(() => setAnimationStep(1), 100) // 봉투 열림
      setTimeout(() => setAnimationStep(2), 800) // 편지 튀어나옴
      setTimeout(() => setAnimationStep(3), 1600) // 편지 펼침
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err))
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  // 데이터가 없는 경우
  if (!letterData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">편지를 찾을 수 없습니다</h1>
          <p className="text-gray-600">올바른 링크로 접속했는지 확인해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {animationStep < 3 ? (
            // 봉투 단계
            <motion.div
              key="envelope"
              className="relative cursor-pointer"
              onClick={handleEnvelopeClick}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* 봉투 디자인 */}
              <div className="relative w-full aspect-[3/2] mx-auto">
                {/* 봉투 본체 */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-lg shadow-2xl overflow-hidden"
                  animate={{
                    rotateX: animationStep >= 1 ? 15 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {/* 봉투 덮개 */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-red-200 to-red-300 origin-top"
                    style={{
                      clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                    }}
                    animate={{
                      rotateX: animationStep >= 1 ? -120 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* 접힌 편지 (튀어나오는 애니메이션) */}
                  {animationStep >= 2 && (
                    <motion.div
                      className="absolute inset-x-4 bottom-4 top-8 bg-white rounded shadow-lg"
                      initial={{ y: 0, scale: 0.8 }}
                      animate={{ y: -100, scale: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}
                </motion.div>

                {/* 안내 텍스트 */}
                {!isOpened && (
                  <motion.div
                    className="absolute -bottom-12 left-0 right-0 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-gray-600 text-sm">편지를 클릭해서 열어보세요</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            // 편지 내용 표시
            <motion.div
              key="letter"
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
            >
              {/* 수신자 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-left"
              >
                <p
                  className="text-lg font-medium text-gray-800"
                  style={{ fontFamily: 'KOTRA_SONGEULSSI, cursive' }}
                >
                  {letterData.receiverName} {letterData.receiverLabel}
                </p>
              </motion.div>

              {/* 편지 내용 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="py-6 border-y border-gray-200"
              >
                <p
                  className="text-gray-700 whitespace-pre-wrap leading-relaxed"
                  style={{ fontFamily: 'KOTRA_SONGEULSSI, cursive' }}
                >
                  {letterData.message}
                </p>
              </motion.div>

              {/* 발신일 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-right"
              >
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: 'KOTRA_SONGEULSSI, cursive' }}
                >
                  2026년 2월 17일
                </p>
              </motion.div>

              {/* 발신인 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-right"
              >
                <p
                  className="text-lg font-medium text-gray-800"
                  style={{ fontFamily: 'KOTRA_SONGEULSSI, cursive' }}
                >
                  {letterData.senderName} {letterData.senderLabel}
                </p>
              </motion.div>

              {/* 버튼들 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex gap-3 pt-4"
              >
                <button
                  onClick={() => navigate('/kiwi')}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors active:scale-95"
                >
                  새로 작성하기
                </button>
                <button
                  onClick={() => navigate('/kiwi', {
                    state: {
                      receiverName: letterData.senderName,
                      receiverLabel: letterData.senderLabel,
                      senderName: letterData.receiverName,
                      senderLabel: letterData.receiverLabel,
                    }
                  })}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors active:scale-95"
                >
                  답신 보내기
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 오디오 */}
        <audio ref={audioRef} loop>
          <source src="/maybe.mp3" type="audio/mpeg" />
        </audio>
      </div>

      {/* 음소거 버튼 */}
      {animationStep >= 3 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={toggleMusic}
          className="fixed bottom-8 right-8 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-50"
        >
          {isMusicPlaying ? (
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
        </motion.button>
      )}

      {/* Footer */}
      <footer className="fixed bottom-4 left-0 right-0 text-center text-sm text-gray-400 z-10">
        Made with ❤️ by WhiteKiwi
      </footer>
    </div>
  )
}
