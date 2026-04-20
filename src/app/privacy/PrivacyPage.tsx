'use client';

import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div>
      <section className="py-5 bg-light">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} href="/">მთავარი</Breadcrumb.Item>
            <Breadcrumb.Item active>კონფიდენციალურობის პოლიტიკა</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="display-5 fw-bold mt-3">კონფიდენციალურობის პოლიტიკა</h1>
          <p className="text-muted">ბოლო განახლება: 2025 წლის 1 იანვარი</p>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="prose-legal">

                <p className="lead text-muted mb-5">
                  HomeSpace („კომპანია", „ჩვენ") პატივს სცემს თქვენს კონფიდენციალურობას.
                  ეს პოლიტიკა განმარტავს, თუ რა სახის პერსონალურ მონაცემებს ვაგროვებთ,
                  როგორ ვიყენებთ და ვიცავთ მათ homespace.ge ვებსაიტის გამოყენებისას.
                </p>

                <h2 className="fw-bold mb-3 mt-5">1. ვინ ვართ</h2>
                <p>
                  <strong>HomeSpace შპს</strong><br />
                  მისამართი: ი. ჭავჭავაძის გამზირი 37, თბილისი, საქართველო<br />
                  ელ. ფოსტა: <a href="mailto:info@homespace.ge">info@homespace.ge</a><br />
                  ტელეფონი: <a href="tel:+995555123456">+995 555 12 34 56</a>
                </p>
                <p>
                  კომპანია წარმოადგენს პერსონალური მონაცემების <strong>დამამუშავებელს</strong> საქართველოს
                  კანონმდებლობის („პერსონალური მონაცემების დაცვის შესახებ" საქართველოს კანონი) და
                  ევროკავშირის ზოგადი მონაცემთა დაცვის რეგლამენტის (GDPR) შესაბამისად,
                  სადაც ეს ვრცელდება.
                </p>

                <h2 className="fw-bold mb-3 mt-5">2. რა მონაცემებს ვაგროვებთ</h2>
                <h3 className="fw-semibold mb-2 fs-5">2.1. მონაცემები, რომლებსაც თქვენ გვაწვდით</h3>
                <ul>
                  <li><strong>სარეგისტრაციო მონაცემები:</strong> სახელი, გვარი, ელ. ფოსტა, პაროლი.</li>
                  <li><strong>შეკვეთის მონაცემები:</strong> მიტანის მისამართი, სატელეფონო ნომერი, გადახდის ინფორმაცია.</li>
                  <li><strong>კომუნიკაცია:</strong> შეტყობინებები, მოთხოვნები, მიმოწერა მხარდაჭერასთან.</li>
                  <li><strong>სურვილების სია / კალათა:</strong> პროდუქტები, რომლებიც შეინახეთ.</li>
                </ul>

                <h3 className="fw-semibold mb-2 fs-5">2.2. ავტომატურად შეგროვებული მონაცემები</h3>
                <ul>
                  <li><strong>ლოგ-მონაცემები:</strong> IP მისამართი, ბრაუზერი, OS, მოთხოვნის დრო.</li>
                  <li><strong>Cookie-ები:</strong> სესიური და ფუნქციური cookie-ები (იხ. მე-7 პუნქტი).</li>
                  <li><strong>ნავიგაციის მონაცემები:</strong> ნანახი გვერდები, ძებნის ისტორია საიტზე.</li>
                </ul>

                <h2 className="fw-bold mb-3 mt-5">3. მიზეთ გამოვიყენებთ თქვენს მონაცემებს</h2>
                <table className="table table-bordered table-sm mb-4">
                  <thead className="table-light">
                    <tr>
                      <th>მიზანი</th>
                      <th>სამართლებრივი საფუძველი</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>შეკვეთის დამუშავება და მიტანა</td>
                      <td>ხელშეკრულების შესრულება</td>
                    </tr>
                    <tr>
                      <td>ანგარიშის მართვა</td>
                      <td>ხელშეკრულების შესრულება</td>
                    </tr>
                    <tr>
                      <td>მხარდაჭერა და პრობლემების გადაჭრა</td>
                      <td>კანონიერი ინტერესი</td>
                    </tr>
                    <tr>
                      <td>საიტის გაუმჯობესება და ანალიტიკა</td>
                      <td>კანონიერი ინტერესი</td>
                    </tr>
                    <tr>
                      <td>სარეკლამო და საინფორმაციო გაგზავნა (Newsletter)</td>
                      <td>თანხმობა</td>
                    </tr>
                    <tr>
                      <td>სამართლებრივი ვალდებულებების შესრულება</td>
                      <td>კანონიერი ვალდებულება</td>
                    </tr>
                  </tbody>
                </table>

                <h2 className="fw-bold mb-3 mt-5">4. მესამე მხარეებთან გაზიარება</h2>
                <p>ჩვენ <strong>არ ვყიდით</strong> თქვენს მონაცემებს. შეიძლება გავუზიაროთ:</p>
                <ul>
                  <li><strong>გადახდის სისტემებს</strong> (მაგ. TBC Pay, BOG Pay) — შეკვეთის გადახდისთვის.</li>
                  <li><strong>კურიერულ სამსახურებს</strong> — მიტანის შესასრულებლად.</li>
                  <li><strong>ანალიტიკის სერვისებს</strong> (Google Analytics) — ანონიმური სტატისტიკისთვის.</li>
                  <li><strong>სახელმწიფო ორგანოებს</strong> — კანონმდებლობის მოთხოვნის შემთხვევაში.</li>
                </ul>
                <p>ყველა მესამე მხარე ვალდებულია დაიცვას მონაცემთა კონფიდენციალურობა.</p>

                <h2 className="fw-bold mb-3 mt-5">5. მონაცემების შენახვის ვადა</h2>
                <ul>
                  <li><strong>შეკვეთები:</strong> 7 წელი (სააღრიცხვო კანონმდებლობა).</li>
                  <li><strong>ანგარიში:</strong> ანგარიშის წაშლიდან 30 დღე, შემდეგ სრული წაშლა.</li>
                  <li><strong>Newsletter:</strong> გამოწერის გაუქმებამდე.</li>
                  <li><strong>ლოგები:</strong> 12 თვე.</li>
                </ul>

                <h2 className="fw-bold mb-3 mt-5">6. თქვენი უფლებები</h2>
                <p>საქართველოს კანონმდებლობისა და GDPR-ის შესაბამისად, გაქვთ უფლება:</p>
                <ul>
                  <li><strong>წვდომა</strong> — მოითხოვოთ თქვენს შესახებ შენახული მონაცემების ასლი.</li>
                  <li><strong>გასწორება</strong> — მოითხოვოთ არასწორი მონაცემების შეცვლა.</li>
                  <li><strong>წაშლა</strong> — „დავიწყების უფლება" (GDPR Art. 17).</li>
                  <li><strong>დამუშავების შეზღუდვა</strong> — დროებით შეაჩეროთ მონაცემების გამოყენება.</li>
                  <li><strong>გადატანადობა</strong> — მიიღოთ მონაცემები სტრუქტურირებულ ფორმატში.</li>
                  <li><strong>წინააღმდეგობა</strong> — კანონიერი ინტერესებზე დაყრდნობით დამუშავებაზე.</li>
                  <li><strong>თანხმობის გახმობა</strong> — ნებისმიერ დროს, retroactive ეფექტის გარეშე.</li>
                </ul>
                <p>
                  მოთხოვნის გასაგზავნად:{' '}
                  <a href="mailto:privacy@homespace.ge">privacy@homespace.ge</a>.
                  ვუპასუხებთ 30 კალენდარული დღის ვადაში.
                </p>

                <h2 className="fw-bold mb-3 mt-5">7. Cookie-ები</h2>
                <p>ვიყენებთ შემდეგ cookie-ებს:</p>
                <table className="table table-bordered table-sm mb-4">
                  <thead className="table-light">
                    <tr>
                      <th>სახელი</th>
                      <th>ტიპი</th>
                      <th>მიზანი</th>
                      <th>ვადა</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>session</code></td>
                      <td>სავალდებულო</td>
                      <td>სესიის მართვა</td>
                      <td>სესია</td>
                    </tr>
                    <tr>
                      <td><code>cart_id</code></td>
                      <td>ფუნქციური</td>
                      <td>კალათის შენახვა</td>
                      <td>30 დღე</td>
                    </tr>
                    <tr>
                      <td><code>locale</code></td>
                      <td>ფუნქციური</td>
                      <td>ენის პარამეტრი</td>
                      <td>1 წელი</td>
                    </tr>
                    <tr>
                      <td><code>_ga</code></td>
                      <td>ანალიტიკური</td>
                      <td>Google Analytics</td>
                      <td>2 წელი</td>
                    </tr>
                  </tbody>
                </table>
                <p>სავალდებულო cookie-ები ავტომატურად ირთვება. ანალიტიკურები — მხოლოდ თქვენი თანხმობით.</p>

                <h2 className="fw-bold mb-3 mt-5">8. მონაცემთა უსაფრთხოება</h2>
                <p>
                  ვიყენებთ TLS/HTTPS დაშიფვრას, წვდომის კონტროლს და რეგულარულ
                  უსაფრთხოების აუდიტს. გადახდის მონაცემები მუშავდება PCI DSS
                  სტანდარტების შესაბამის სისტემებში — ჩვენ არ ვინახავთ ბარათის ნომრებს.
                </p>

                <h2 className="fw-bold mb-3 mt-5">9. ბავშვების კონფიდენციალურობა</h2>
                <p>
                  ჩვენი სერვისი განკუთვნილია 16 წლის და უფროსი ასაკის პირებისთვის.
                  შეგნებულად არ ვაგროვებთ 16 წლამდე ბავშვების მონაცემებს.
                  თუ შეამჩნევთ ასეთ შემთხვევას, გთხოვთ, დაგვიკავშირდეთ.
                </p>

                <h2 className="fw-bold mb-3 mt-5">10. პოლიტიკის ცვლილებები</h2>
                <p>
                  ამ პოლიტიკის ცვლილებისას განვაახლებთ „ბოლო განახლების" თარიღს.
                  მნიშვნელოვანი ცვლილებების შემთხვევაში შეგატყობინებთ ელ. ფოსტით
                  ან საიტზე შეტყობინებით.
                </p>

                <h2 className="fw-bold mb-3 mt-5">11. კონტაქტი</h2>
                <p>
                  კონფიდენციალურობის საკითხებთან დაკავშირებით:{' '}
                  <a href="mailto:privacy@homespace.ge">privacy@homespace.ge</a>
                  <br />
                  თუ მიგაჩნიათ, რომ თქვენი უფლებები ირღვევა, შეგიძლიათ მიმართოთ
                  საქართველოს პერსონალური მონაცემთა დაცვის სამსახურს:{' '}
                  <a href="https://pdp.ge" target="_blank" rel="noopener noreferrer">pdp.ge</a>.
                </p>

              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
