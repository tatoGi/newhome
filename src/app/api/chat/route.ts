import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';
import { getAllProducts, getAllServices, getAllProjects } from '@/lib/data';

// ─── Dynamic system prompt built from live site data ───────────────────────
function buildSystemPrompt(): string {
  const products = getAllProducts();
  const services = getAllServices();
  const projects = getAllProjects();

  const productList = products
    .map(
      (p) =>
        `• ${p.name} — ${p.price}₾${p.oldPrice ? ` (ძველი ფასი: ${p.oldPrice}₾)` : ''}${p.sale ? ' 🔥 აქცია' : ''}
   კატეგორია: ${p.category} | მასალა: ${p.material ?? '—'}
   ${p.description ?? ''}`
    )
    .join('\n');

  const serviceList = services
    .map((s) => `• ${s.title} — ${s.desc}\n   ფუნქციები: ${s.features.join(', ')}`)
    .join('\n');

  const projectList = projects
    .map(
      (p) =>
        `• ${p.title} (${p.year}) — ${p.location} | ${p.area} | ${p.category}\n   ${p.desc}`
    )
    .join('\n');

  return `შენ ხარ NewHome.ge-ს ჭკვიანი ონლაინ ასისტენტი — ავეჯისა და განათების პრემიუმ მაღაზიის.
შენ კარგად იცი ჩვენი მთელი კატალოგი, სერვისები და დასრულებული პროექტები.

━━━ ჩვენი პროდუქცია (${products.length} პოზიცია) ━━━
${productList}

━━━ ჩვენი სერვისები ━━━
${serviceList}

━━━ განხორციელებული პროექტები ━━━
${projectList}

━━━ კონტაქტი ━━━
• მისამართი: თბილისი, ი. ჭავჭავაძის გამზირი 37
• ტელეფონი: +995 555 12 34 56
• ელ-ფოსტა: info@newhome.ge
• სამუშაო საათები: ორშაბათი–შაბათი 10:00–19:00

━━━ წესები ━━━
- პასუხობ მხოლოდ ქართულად
- იყავი მეგობრული, კონკრეტული და მოკლე (3-4 წინადადება)
- თუ კონკრეტულ პროდუქტს ეძებენ, მიუთითე ზუსტი სახელი და ფასი
- თუ ვერ პასუხობ — შესთავაზე ტელეფონზე დარეკვა: +995 555 12 34 56`;
}

// ─── POST handler ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const groq = new Groq({ apiKey });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: buildSystemPrompt() },
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
        controller.enqueue(
          encoder.encode('ბოდიში, დროებითი შეფერხებაა. სცადეთ მოგვიანებით.')
        );
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
