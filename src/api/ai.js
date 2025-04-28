import request from '@/utils/request'

const API_KEY = 'sk-308f7bc0aff44e1aa828c9de74a60857'

export const chatWithAI = (message, onProgress) => {
  return fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
      // stream: false,
      // stream_options: {
      //   include_usage: true
      // },
      // modalities: ['text']
    })
  }).then(async (response) => {
    console.log(response)
    // // 检查响应头中的Content-Type
    const contentType = response.headers.get('Content-Type')
    // // 如果是非流式响应
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log(data)
      if (data.choices?.[0]?.message?.content) {
        onProgress(data.choices[0].message.content)
      }
      return Promise.resolve()
    }
    // // 如果是流式响应
    // const reader = response.body.getReader()
    // const decoder = new TextDecoder()
    // let buffer = ''
    // return new Promise((resolve, reject) => {
    //   function processText({ done, value }) {
    //     if (done) {
    //       return resolve()
    //     }
    //     buffer += decoder.decode(value, { stream: true })
    //     const lines = buffer.split('\n')
    //     buffer = lines.pop() // Keep the last incomplete line in the buffer
    //     for (const line of lines) {
    //       if (line.trim() === '') continue
    //       if (line === 'data: [DONE]') {
    //         return resolve()
    //       }
    //       const message = line.replace(/^data: /, '')
    //       try {
    //         const data = JSON.parse(message)
    //         if (data.choices?.[0]?.delta?.content) {
    //           onProgress(data.choices[0].delta.content)
    //         }
    //       } catch (error) {
    //         console.error('Error parsing JSON:', error)
    //       }
    //     }
    //     return reader.read().then(processText)
    //   }
    //   reader.read().then(processText).catch(reject)
    // })
  })
}
