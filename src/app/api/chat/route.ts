import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';
import { api } from '@/lib/api/client';

async function buildSystemPrompt(): Promise<string> {
  let productList = '';
  let serviceList = '';
  let projectList = '';
  let productCount = 0;

  try {
    const data = await api.getProducts();
    const products = data.products ?? [];
    productCount = products.length;
    productList = products
      .map(
        (p) =>
          `• ${p.title} — ${p.price}₾${p.old_price ? ` (ძველი ფასი: ${p.old_price}₾)` : ''}${p.on_sale ? ' 🔥 აქცია' : ''}\n   კატეგორია: ${p.category}${p.brand ? ` | ბრენდი: ${p.brand}` : ''}`
      )
      .join('\n');
  } catch {}

  try {
    const bootstrap = await api.getBootstrap();

    const serviceRoute = bootstrap.routeMap.find((r) => r.template === 'service' || r.template === 'services');
    if (serviceRoute) {
      const serviceData = await api.getPage(serviceRoute.slug);
      serviceList = (serviceData.relations?.posts ?? [])
        .map((s) => `• ${s.title}${s.excerpt ? ` — ${s.excerpt.replace(/<[^>]*>/g, '')}` : ''}`)
        .join('\n');
    }

    const projectRoute = bootstrap.routeMap.find((r) => r.template === 'project' || r.template === 'projects');
    if (projectRoute) {
      const projectData = await api.getPage(projectRoute.slug);
      projectList = (projectData.relations?.posts ?? [])
        .map((p) => `• ${p.title}${p.category ? ` (${p.category})` : ''}${p.excerpt ? ` — ${p.excerpt.replace(/<[^>]*>/g, '')}` : ''}`)
        .join('\n');
    }
  } catch {}

  return `შენ ხარ HomeSpace.ge-ს ჭკვიანი ონლაინ ასისტენტი — ავეჯისა და განათების პრემიუმ მაღაზიის.
შენ კარგად იცი ჩვენი მთელი კატალოგი, სერვისები და დასრულებული პროექტები.

${productList ? `━━━ ჩვენი პროდუქცია (${productCount} პოზიცია) ━━━\n${productList}\n` : ''}
${serviceList ? `━━━ ჩვენი სერვისები ━━━\n${serviceList}\n` : ''}
${projectList ? `━━━ განხორციელებული პროექტები ━━━\n${projectList}\n` : ''}
━━━ კონტაქტი ━━━
• საიტი: https://homespace.ge

━━━ წესები ━━━
- პასუხობ მხოლოდ ქართულად
- იყავი მეგობრული, კონკრეტული და მოკლე (3-4 წინადადება)
- თუ კონკრეტულ პროდუქტს ეძებენ, მიუთითე ზუსტი სახელი და ფასი
- თუ ვერ პასუხობ — შესთავაზე საიტის მონახულება: https://homespace.ge`;
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const groq = new Groq({ apiKey });
  const systemPrompt = await buildSystemPrompt();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 512,
        });

        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        console.error('Groq error:', err);
        controller.enqueue(encoder.encode('ბოდიში, დროებითი შეფერხებაა. სცადეთ მოგვიანებით.'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
