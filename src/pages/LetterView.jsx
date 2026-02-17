import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function LetterView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [letterData, setLetterData] = useState(null)
  const [isOpened, setIsOpened] = useState(false)
  const [animationStep, setAnimationStep] = useState(0) // 0: 봉투, 1: 봉투 열림, 2: 편지 튀어나옴, 3: 편지 펼침
  const [showMoneyPopup, setShowMoneyPopup] = useState(false)

  useEffect(() => {
    // URL에서 f 파라미터 가져오기
    const encodedData = searchParams.get('f')

    if (encodedData) {
      try {
        // base64 디코딩
        const jsonString = decodeURIComponent(escape(atob(encodedData)))
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
      // 애니메이션 단계별 진행
      setTimeout(() => setAnimationStep(1), 100) // 봉투 열림
      setTimeout(() => setAnimationStep(2), 800) // 편지 튀어나옴
      setTimeout(() => setAnimationStep(3), 1600) // 편지 펼침
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
                  onClick={() => setShowMoneyPopup(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-colors active:scale-95"
                >
                  용돈 보내기
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

              {/* 용돈 보내기 팝업 */}
              <AnimatePresence>
                {showMoneyPopup && (
                  <>
                    {/* 배경 오버레이 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowMoneyPopup(false)}
                      className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* 팝업 */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-50 w-[90%] max-w-sm"
                    >
                      <div className="text-center space-y-6">
                        <p className="text-2xl font-bold text-gray-800">
                          용돈은 마음만 받을게요.<br />밥 사주세요!
                        </p>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowMoneyPopup(false)}
                            className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                          >
                            닫기
                          </button>
                          <button
                            onClick={() => {
                              window.location.href = 'kakaotalk://'
                              setShowMoneyPopup(false)
                            }}
                            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-colors"
                          >
                            생각난 김에 연락하러 가기
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
