import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function LetterCreate() {
  const location = useLocation()
  const prefillData = location.state || {}

  const [formData, setFormData] = useState({
    receiverName: prefillData.receiverName || '',
    receiverLabel: prefillData.receiverLabel || '님께',
    message: '',
    senderName: prefillData.senderName || '',
    senderLabel: prefillData.senderLabel || '드림',
  })
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateLink = () => {
    // JSON을 base64url로 인코딩 (URL safe)
    const jsonString = JSON.stringify(formData)
    const base64Encoded = btoa(unescape(encodeURIComponent(jsonString)))
      .replace(/\+/g, '-')  // + → -
      .replace(/\//g, '_')  // / → _
      .replace(/=+$/, '')   // 패딩 제거

    // URL 생성
    const url = `https://happynewyear-2026.whitekiwi.link/?f=${base64Encoded}`

    return url
  }

  const handleCopyLink = async () => {
    const link = generateLink()

    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    const link = generateLink()

    // Web Share API 지원 확인
    if (navigator.share) {
      try {
        await navigator.share({
          title: '새해 편지가 도착했어요!',
          text: `${formData.senderName}님이 보낸 새해 편지를 확인해보세요`,
          url: link,
        })
      } catch (err) {
        // 사용자가 취소한 경우 등
        if (err.name !== 'AbortError') {
          console.error('Failed to share:', err)
          // 폴백: 링크 복사
          handleCopyLink()
        }
      }
    } else {
      // Web Share API 미지원 시 링크 복사
      handleCopyLink()
    }
  }

  const isFormValid = formData.receiverName && formData.receiverLabel && formData.message && formData.senderName && formData.senderLabel

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">새해 편지 작성</h1>
          <p className="text-gray-600 mb-8">소중한 사람에게 새해 인사를 전해보세요</p>

          <div className="space-y-6">
            {/* 수신자 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수신자
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  id="receiverName"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  placeholder="이름 (예: 김토스)"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <input
                  type="text"
                  id="receiverLabel"
                  name="receiverLabel"
                  value={formData.receiverLabel}
                  onChange={handleChange}
                  placeholder="표기 (예: 님께)"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* 편지 내용 */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                편지 내용
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="새해 인사 메시지를 작성해주세요..."
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {/* 발신인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                발신인
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  placeholder="이름 (예: 장키위)"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <input
                  type="text"
                  id="senderLabel"
                  name="senderLabel"
                  value={formData.senderLabel}
                  onChange={handleChange}
                  placeholder="표기 (예: 올림)"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                disabled={!isFormValid}
                className={`flex-1 py-4 rounded-lg font-semibold text-white transition-all ${
                  isFormValid
                    ? 'bg-gray-600 hover:bg-gray-700 active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {copied ? '✓ 복사됨' : '링크 복사'}
              </button>
              <button
                onClick={handleShare}
                disabled={!isFormValid}
                className={`flex-1 py-4 rounded-lg font-semibold text-white transition-all ${
                  isFormValid
                    ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                공유하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
