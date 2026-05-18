'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, MessageSquare, CheckCircle } from 'lucide-react'


export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const form = e.currentTarget
      const data = new FormData(form)
      const res = await fetch('https://formspree.io/f/mgorgdbj', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-lg card-elevated">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            {submitted
              ? <CheckCircle className="w-6 h-6 text-primary" />
              : <MessageSquare className="w-6 h-6 text-primary" />
            }
          </div>
          <CardTitle className="text-2xl font-bold">
            {submitted ? '메시지를 보냈어요!' : '개발자와 소통하기'}
          </CardTitle>
          <CardDescription>
            {submitted
              ? '소중한 의견 감사합니다. 빠른 시일 내에 확인하겠습니다 😊'
              : '개선사항, 버그 제보, 추가를 원하는 기기 등 무엇이든 자유롭게 보내주세요!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-4">
              <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2">
                다른 메시지 보내기
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  답변 받을 이메일 (선택)
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@email.com"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  내용 (필수)
                </label>
                <Textarea
                  name="message"
                  id="message"
                  required
                  placeholder="여기에 내용을 자세히 적어주세요..."
                  className="min-h-[150px] bg-background"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" disabled={isSubmitting} className="w-full btn-premium py-6 text-lg group">
                <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                {isSubmitting ? '전송 중...' : '메시지 보내기'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
