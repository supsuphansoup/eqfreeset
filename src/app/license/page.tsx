import type { Metadata } from 'next'
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: '오픈소스 라이선스',
  description: 'EQ FreeSet에 사용된 AutoEq, Next.js, shadcn/ui, Zustand 등 오픈소스 라이브러리 라이선스 고지.',
  alternates: { canonical: '/license' },
}

export default function LicensePage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">오픈소스 라이선스</h1>
      <Card>
        <CardContent className="p-6 prose dark:prose-invert max-w-none">
          <p>EQ FreeSet은 다양한 훌륭한 오픈소스 프로젝트들의 도움으로 만들어졌습니다. 아래는 본 서비스에 사용된 주요 오픈소스 라이브러리와 데이터에 대한 고지사항입니다.</p>

          <h2>1. AutoEq</h2>
          <p>본 서비스의 기기별 주파수 응답 및 Base EQ 데이터는 <strong>Jaakko Pasanen</strong>님의 <strong>AutoEq</strong> 프로젝트 데이터를 기반으로 활용 및 가공되었습니다.</p>
          <ul>
            <li><strong>Project:</strong> <a href="https://github.com/jaakkopasanen/AutoEq" target="_blank" rel="noopener noreferrer">AutoEq</a></li>
            <li><strong>License:</strong> MIT License</li>
            <li><strong>Copyright:</strong> Copyright (c) 2018-2022 Jaakko Pasanen</li>
          </ul>

          <h2>2. Next.js & React</h2>
          <ul>
            <li><strong>Project:</strong> <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">Next.js</a>, React</li>
            <li><strong>License:</strong> MIT License</li>
            <li><strong>Copyright:</strong> Copyright (c) Vercel, Inc., Meta Platforms, Inc. and affiliates.</li>
          </ul>

          <h2>3. UI Components & Libraries</h2>
          <ul>
            <li><strong>shadcn/ui:</strong> MIT License (Copyright (c) 2023 shadcn)</li>
            <li><strong>Lucide Icons:</strong> ISC License</li>
            <li><strong>Tailwind CSS:</strong> MIT License (Copyright (c) Tailwind Labs, Inc.)</li>
            <li><strong>Zustand:</strong> MIT License</li>
          </ul>

          <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
            <h3 className="text-lg font-semibold mb-2 mt-0">The MIT License (MIT)</h3>
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the &ldquo;Software&rdquo;), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p>
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            <p>
              THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
