'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, MessageSquare, CheckCircle } from 'lucide-react'
import { useLanguage, type LangCode } from '@/lib/language-context'

const CONTENT: Record<LangCode, {
  title: string
  desc: string
  successTitle: string
  successDesc: string
  sendAnother: string
  emailLabel: string
  emailPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submit: string
  submitting: string
  errorSend: string
  errorNetwork: string
}> = {
  ko: {
    title: '개발자와 소통하기',
    desc: '개선사항, 버그 제보, 추가를 원하는 기기 등 무엇이든 자유롭게 보내주세요!',
    successTitle: '메시지를 보냈어요!',
    successDesc: '소중한 의견 감사합니다. 빠른 시일 내에 확인하겠습니다 😊',
    sendAnother: '다른 메시지 보내기',
    emailLabel: '답변 받을 이메일 (선택)',
    emailPlaceholder: 'example@email.com',
    messageLabel: '내용 (필수)',
    messagePlaceholder: '여기에 내용을 자세히 적어주세요...',
    submit: '메시지 보내기',
    submitting: '전송 중...',
    errorSend: '전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
    errorNetwork: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  },
  en: {
    title: 'Contact the Developer',
    desc: 'Feel free to send anything — suggestions, bug reports, device requests, or anything else!',
    successTitle: 'Message Sent!',
    successDesc: 'Thank you for your feedback. I will get back to you as soon as possible 😊',
    sendAnother: 'Send another message',
    emailLabel: 'Your email for reply (optional)',
    emailPlaceholder: 'example@email.com',
    messageLabel: 'Message (required)',
    messagePlaceholder: 'Please describe in detail...',
    submit: 'Send Message',
    submitting: 'Sending...',
    errorSend: 'Failed to send. Please try again later.',
    errorNetwork: 'A network error occurred. Please try again.',
  },
  zh: {
    title: '联系开发者',
    desc: '欢迎发送任何内容——改进建议、错误报告、设备请求等！',
    successTitle: '消息已发送！',
    successDesc: '感谢您的宝贵意见，我会尽快回复您 😊',
    sendAnother: '发送另一条消息',
    emailLabel: '回复邮箱（可选）',
    emailPlaceholder: 'example@email.com',
    messageLabel: '内容（必填）',
    messagePlaceholder: '请详细描述...',
    submit: '发送消息',
    submitting: '发送中...',
    errorSend: '发送失败，请稍后再试。',
    errorNetwork: '网络错误，请重试。',
  },
  ja: {
    title: '開発者に連絡',
    desc: '改善案、バグ報告、追加希望デバイスなど、何でもお気軽にどうぞ！',
    successTitle: 'メッセージを送りました！',
    successDesc: 'ご意見ありがとうございます。なるべく早くご確認いたします 😊',
    sendAnother: '別のメッセージを送る',
    emailLabel: '返信用メール（任意）',
    emailPlaceholder: 'example@email.com',
    messageLabel: '内容（必須）',
    messagePlaceholder: 'こちらに詳しく記入してください...',
    submit: 'メッセージを送る',
    submitting: '送信中...',
    errorSend: '送信に失敗しました。しばらくしてからもう一度お試しください。',
    errorNetwork: 'ネットワークエラーが発生しました。再試行してください。',
  },
}

export default function ContactPage() {
  const { lang } = useLanguage()
  const c = CONTENT[lang] ?? CONTENT.ko

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
        setError(c.errorSend)
      }
    } catch {
      setError(c.errorNetwork)
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
            {submitted ? c.successTitle : c.title}
          </CardTitle>
          <CardDescription>
            {submitted ? c.successDesc : c.desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-4">
              <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2">
                {c.sendAnother}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {c.emailLabel}
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={c.emailPlaceholder}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  {c.messageLabel}
                </label>
                <Textarea
                  name="message"
                  id="message"
                  required
                  placeholder={c.messagePlaceholder}
                  className="min-h-[150px] bg-background"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" disabled={isSubmitting} className="w-full btn-premium py-6 text-lg group">
                <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                {isSubmitting ? c.submitting : c.submit}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
