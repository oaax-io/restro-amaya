import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/layout/LegalLayout";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz — Amaya Restaurant" },
      { name: "description", content: "Datenschutzerklärung der Amaya Restaurant / Gastroverse AG." },
      { property: "og:title", content: "Datenschutz — Amaya Restaurant" },
      { property: "og:description", content: "Datenschutzerklärung der Amaya Restaurant / Gastroverse AG." },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <p>
        Verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere der EU-Datenschutzgrundverordnung (DSGVO), ist:
      </p>
      <p className="not-prose">
        <strong>AMAYA RESTAURANT</strong>
        <br />Gastroverse AG
        <br />Stationsstrasse 9
        <br />6023 Rothenburg
        <br />E-Mail: info@amaya-restaurant.ch
        <br />Website: www.amaya-restaurant.ch
      </p>

      <LegalSection title="Allgemeiner Hinweis">
        Gestützt auf Artikel 13 der schweizerischen Bundesverfassung und die datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) hat jede Person Anspruch auf Schutz ihrer Privatsphäre sowie auf Schutz vor Missbrauch ihrer persönlichen Daten. Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.

        In Zusammenarbeit mit unseren Hosting-Providern bemühen wir uns, die Datenbanken so gut wie möglich vor fremden Zugriffen, Verlusten, Missbrauch oder vor Fälschung zu schützen.

        Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.

        Durch die Nutzung dieser Website erklären Sie sich mit der Erhebung, Verarbeitung und Nutzung von Daten gemäss der nachfolgenden Beschreibung einverstanden. Diese Website kann grundsätzlich ohne Registrierung besucht werden. Dabei werden Daten wie beispielsweise aufgerufene Seiten bzw. Namen der abgerufenen Datei, Datum und Uhrzeit zu statistischen Zwecken auf dem Server gespeichert, ohne dass diese Daten unmittelbar auf Ihre Person bezogen werden. Personenbezogene Daten, insbesondere Name, Adresse oder E-Mail-Adresse werden soweit möglich auf freiwilliger Basis erhoben. Ohne Ihre Einwilligung erfolgt keine Weitergabe der Daten an Dritte.
      </LegalSection>

      <LegalSection title="Bearbeitung von Personendaten">
        Personendaten sind alle Angaben, die sich auf eine bestimmte oder bestimmbare Person beziehen. Eine betroffene Person ist eine Person, über die Personendaten bearbeitet werden. Bearbeiten umfasst jeden Umgang mit Personendaten, unabhängig von den angewandten Mitteln und Verfahren, insbesondere das Aufbewahren, Bekanntgeben, Beschaffen, Löschen, Speichern, Verändern, Vernichten und Verwenden von Personendaten.

        Wir bearbeiten Personendaten im Einklang mit dem schweizerischen Datenschutzrecht. Im Übrigen bearbeiten wir – soweit und sofern die EU-DSGVO anwendbar ist – Personendaten gemäss folgenden Rechtsgrundlagen im Zusammenhang mit Art. 6 Abs. 1 DSGVO:

        - lit. a) Bearbeitung von Personendaten mit Einwilligung der betroffenen Person.
        - lit. b) Bearbeitung von Personendaten zur Erfüllung eines Vertrages mit der betroffenen Person sowie zur Durchführung entsprechender vorvertraglicher Massnahmen.
        - lit. c) Bearbeitung von Personendaten zur Erfüllung einer rechtlichen Verpflichtung, der wir gemäss allenfalls anwendbarem Recht der EU oder gemäss allenfalls anwendbarem Recht eines Landes, in dem die DSGVO ganz oder teilweise anwendbar ist, unterliegen.
        - lit. d) Bearbeitung von Personendaten um lebenswichtige Interessen der betroffenen Person oder einer anderen natürlichen Person zu schützen.
        - lit. f) Bearbeitung von Personendaten um die berechtigten Interessen von uns oder von Dritten zu wahren, sofern nicht die Grundfreiheiten und Grundrechte sowie Interessen der betroffenen Person überwiegen. Berechtigte Interessen sind insbesondere unser betriebswirtschaftliches Interesse, unsere Website bereitstellen zu können, die Informationssicherheit, die Durchsetzung von eigenen rechtlichen Ansprüchen und die Einhaltung von schweizerischem Recht.

        Wir bearbeiten Personendaten für jene Dauer, die für den jeweiligen Zweck oder die jeweiligen Zwecke erforderlich ist. Bei länger dauernden Aufbewahrungspflichten aufgrund von gesetzlichen und sonstigen Pflichten, denen wir unterliegen, schränken wir die Bearbeitung entsprechend ein.
      </LegalSection>

      <LegalSection title="Cookies">
        Diese Website verwendet Cookies. Das sind kleine Textdateien, die es möglich machen, auf dem Endgerät des Nutzers spezifische, auf den Nutzer bezogene Informationen zu speichern, während er die Website nutzt. Cookies ermöglichen es, insbesondere Nutzungshäufigkeit und Nutzeranzahl der Seiten zu ermitteln, Verhaltensweisen der Seitennutzung zu analysieren, aber auch unser Angebot kundenfreundlicher zu gestalten. Cookies bleiben über das Ende einer Browser-Sitzung gespeichert und können bei einem erneuten Seitenbesuch wieder aufgerufen werden. Wenn Sie das nicht wünschen, sollten Sie Ihren Internetbrowser so einstellen, dass er die Annahme von Cookies verweigert.

        Ein genereller Widerspruch gegen den Einsatz der zu Zwecken des Onlinemarketing eingesetzten Cookies kann bei einer Vielzahl der Dienste, vor allem im Fall des Trackings, über die US-amerikanische Seite http://www.aboutads.info/choices/ oder die EU-Seite http://www.youronlinechoices.com/ erklärt werden. Des Weiteren kann die Speicherung von Cookies mittels deren Abschaltung in den Einstellungen des Browsers erreicht werden. Bitte beachten Sie, dass dann gegebenenfalls nicht alle Funktionen dieses Onlineangebotes genutzt werden können.
      </LegalSection>

      <LegalSection title="SSL-/TLS-Verschlüsselung">
        Diese Website nutzt aus Gründen der Sicherheit und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel der Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.

        Wenn die SSL bzw. TLS Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
      </LegalSection>

      <LegalSection title="Server-Log-Files">
        Der Provider dieser Website erhebt und speichert automatisch Informationen in so genannten Server-Log Files, die Ihr Browser automatisch an uns übermittelt. Dies sind:

        - Browsertyp und Browserversion
        - verwendetes Betriebssystem
        - Referrer URL
        - Hostname des zugreifenden Rechners
        - Uhrzeit der Serveranfrage

        Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Wir behalten uns vor, diese Daten nachträglich zu prüfen, wenn uns konkrete Anhaltspunkte für eine rechtswidrige Nutzung bekannt werden.
      </LegalSection>

      <LegalSection title="Dienste von Dritten">
        Diese Dienste der amerikanischen Google LLC verwenden unter anderem Cookies und infolgedessen werden Daten an Google in den USA übertragen, wobei wir davon ausgehen, dass in diesem Rahmen kein personenbezogenes Tracking allein durch die Nutzung unserer Website stattfindet. Google hat sich verpflichtet, einen angemessenen Datenschutz gemäss dem amerikanisch-europäischen und dem amerikanisch-schweizerischen Privacy Shield zu gewährleisten. Weitere Informationen finden sich in der Datenschutzerklärung von Google.
      </LegalSection>

      <LegalSection title="Kontaktformular">
        Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
      </LegalSection>

      <LegalSection title="Newsletterdaten">
        Wenn Sie den auf dieser Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind. Weitere Daten werden nicht erhoben. Diese Daten verwenden wir ausschließlich für den Versand der angeforderten Informationen und geben sie nicht an Dritte weiter.

        Die erteilte Einwilligung zur Speicherung der Daten, der E-Mail-Adresse sowie deren Nutzung zum Versand des Newsletters können Sie jederzeit widerrufen, etwa über den "Austragen"-Link im Newsletter.
      </LegalSection>

      <LegalSection title="Recht auf Auskunft, Löschung, Sperrung">
        Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
      </LegalSection>

      <LegalSection title="Kostenpflichtige Leistungen">
        Zur Erbringung kostenpflichtiger Leistungen werden von uns zusätzliche Daten erfragt, wie z.B. Zahlungsangaben, um Ihre Bestellung resp. Ihren Auftrag ausführen zu können. Wir speichern diese Daten in unseren Systemen, bis die gesetzlichen Aufbewahrungsfristen abgelaufen sind.
      </LegalSection>

      <LegalSection title="Google Maps">
        Diese Website verwendet Google Maps API, um geographische Informationen visuell darzustellen. Bei der Nutzung von Google Maps werden von Google auch Daten über die Nutzung der Kartenfunktionen durch Besucher erhoben, verarbeitet und genutzt. Nähere Informationen über die Datenverarbeitung durch Google können Sie den Google-Datenschutzhinweisen entnehmen. Dort können Sie im Datenschutzcenter auch Ihre persönlichen Datenschutz-Einstellungen verändern.
      </LegalSection>

      <LegalSection title="Google AdWords">
        Diese Website nutzt das Google Conversion-Tracking. Sind Sie über eine von Google geschaltete Anzeige auf unsere Website gelangt, wird von Google Adwords ein Cookie auf Ihrem Rechner gesetzt. Das Cookie für Conversion-Tracking wird gesetzt, wenn ein Nutzer auf eine von Google geschaltete Anzeige klickt. Diese Cookies verlieren nach 30 Tagen ihre Gültigkeit und dienen nicht der persönlichen Identifizierung. Besucht der Nutzer bestimmte Seiten unserer Website und das Cookie ist noch nicht abgelaufen, können wir und Google erkennen, dass der Nutzer auf die Anzeige geklickt hat und zu dieser Seite weitergeleitet wurde. Jeder Google AdWords-Kunde erhält ein anderes Cookie. Cookies können somit nicht über die Websites von AdWords-Kunden nachverfolgt werden. Die mithilfe des Conversion-Cookies eingeholten Informationen dienen dazu, Conversion-Statistiken für AdWords-Kunden zu erstellen, die sich für Conversion-Tracking entschieden haben. Die Kunden erfahren die Gesamtanzahl der Nutzer, die auf ihre Anzeige geklickt haben und zu einer mit einem Conversion-Tracking-Tag versehenen Seite weitergeleitet wurden. Sie erhalten jedoch keine Informationen, mit denen sich Nutzer persönlich identifizieren lassen.

        Möchten Sie nicht am Tracking teilnehmen, können Sie das hierfür erforderliche Setzen eines Cookies ablehnen – etwa per Browser-Einstellung, die das automatische Setzen von Cookies generell deaktiviert oder Ihren Browser so einstellen, dass Cookies von der Domain "googleleadservices.com" blockiert werden.

        Bitte beachten Sie, dass Sie die Opt-out-Cookies nicht löschen dürfen, solange Sie keine Aufzeichnung von Messdaten wünschen. Haben Sie alle Ihre Cookies im Browser gelöscht, müssen Sie das jeweilige Opt-out Cookie erneut setzen.
      </LegalSection>

      <LegalSection title="Google Remarketing">
        Diese Website verwendet die Remarketing-Funktion der Google Inc. Die Funktion dient dazu, Webseitenbesuchern innerhalb des Google-Werbenetzwerks interessenbezogene Werbeanzeigen zu präsentieren. Im Browser des Webseitenbesuchers wird ein sog. "Cookie" gespeichert, der es ermöglicht, den Besucher wiederzuerkennen, wenn dieser Webseiten aufruft, die dem Werbenetzwerk von Google angehören. Auf diesen Seiten können dem Besucher Werbeanzeigen präsentiert werden, die sich auf Inhalte beziehen, die der Besucher zuvor auf Webseiten aufgerufen hat, die die Remarketing Funktion von Google verwenden.

        Nach eigenen Angaben erhebt Google bei diesem Vorgang keine personenbezogenen Daten. Sollten Sie die Funktion Remarketing von Google dennoch nicht wünschen, können Sie diese grundsätzlich deaktivieren, indem Sie die entsprechenden Einstellungen unter http://www.google.com/settings/ads vornehmen. Alternativ können Sie den Einsatz von Cookies für interessenbezogene Werbung über die Werbenetzwerkinitiative deaktivieren, indem Sie den Anweisungen unter http://www.networkadvertising.org/managing/opt_out.asp folgen.
      </LegalSection>

      <LegalSection title="Google reCAPTCHA">
        Diese Website verwendet den Dienst reCAPTCHA der Google Inc. (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA; "Google"). Die Abfrage dient dem Zweck der Unterscheidung, ob die Eingabe durch einen Menschen oder durch automatisierte, maschinelle Verarbeitung erfolgt. Die Abfrage schliesst den Versand der IP-Adresse und ggf. weiterer von Google für den Dienst reCAPTCHA benötigter Daten an Google ein. Zu diesem Zweck wird Ihre Eingabe an Google übermittelt und dort weiter verwendet. Ihre IP-Adresse wird von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung dieses Dienstes auszuwerten. Die im Rahmen von reCaptcha von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Ihre Daten werden dabei gegebenenfalls auch in die USA übermittelt. Für Datenübermittlungen in die USA ist ein Angemessenheitsbeschluss der Europäischen Kommission, das "Privacy Shield", vorhanden. Google nimmt am "Privacy Shield" teil und hat sich den Vorgaben unterworfen. Mit Betätigen der Abfrage willigen Sie in die Verarbeitung Ihrer Daten ein. Die Verarbeitung erfolgt auf Grundlage des Art. 6 (1) lit. a DSGVO mit Ihrer Einwilligung. Sie können Ihre Einwilligung jederzeit widerrufen, ohne dass die Rechtmässigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung berührt wird.

        Nähere Informationen zu Google reCAPTCHA sowie die dazugehörige Datenschutzerklärung finden Sie unter: https://www.google.com/privacy/ads/
      </LegalSection>

      <LegalSection title="Google Analytics">
        Diese Website verwendet Google Analytics, einen Webanalysedienst von Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Zur Deaktivierung von Google Analytics stellt Google unter https://tools.google.com/dlpage/gaoptout?hl=de ein Browser-Plug-In zur Verfügung. Google Analytics verwendet Cookies. Das sind kleine Textdateien, die es möglich machen, auf dem Endgerät des Nutzers spezifische, auf den Nutzer bezogene Informationen zu speichern. Diese ermöglichen eine Analyse der Nutzung unseres Websiteangebotes durch Google. Die durch den Cookie erfassten Informationen über die Nutzung unserer Seiten (einschliesslich Ihrer IP-Adresse) werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Wir weisen darauf hin, dass auf dieser Website Google Analytics um den Code "gat._anonymizeIp();" erweitert wurde, um eine anonymisierte Erfassung von IP-Adressen (sog. IP-Masking) zu gewährleisten. Ist die Anonymisierung aktiv, kürzt Google IP-Adressen innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum, weswegen keine Rückschlüsse auf Ihre Identität möglich sind. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Google beachtet die Datenschutzbestimmungen des "Privacy Shield"-Abkommens und ist beim "Privacy Shield"-Programm des US-Handelsministeriums registriert und nutzt die gesammelten Informationen, um die Nutzung unserer Websites auszuwerten, Berichte für uns diesbezüglich zu verfassen und andere diesbezügliche Dienstleistungen an uns zu erbringen. Mehr erfahren Sie unter https://support.google.com/analytics/answer/6004245?hl=de.
      </LegalSection>

      <LegalSection title="Google AdSense">
        Diese Website benutzt Google AdSense, einen Dienst zum Einbinden von Werbeanzeigen von Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Google AdSense verwendet sog. "Cookies", Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website ermöglicht. Google AdSense verwendet auch so genannte Web Beacons (unsichtbare Grafiken). Durch diese Web Beacons können Informationen wie der Besucherverkehr auf diesen Seiten ausgewertet werden. Die durch Cookies und Web Beacons erzeugten Informationen über die Benutzung dieser Website (einschließlich Ihrer IP-Adresse) und Auslieferung von Werbeformaten werden an einen Server von Google in den USA übertragen und dort gespeichert. Diese Informationen können von Google an Vertragspartner von Google weiter gegeben werden. Google wird Ihre IP-Adresse jedoch nicht mit anderen von Ihnen gespeicherten Daten zusammenführen. Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website voll umfänglich nutzen können. Durch die Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und Weise und zu dem zuvor benannten Zweck einverstanden.
      </LegalSection>

      <LegalSection title="Google Web Fonts">
        Diese Website nutzt zur einheitlichen Darstellung von Schriftarten so genannte Web Fonts, die von Google bereitgestellt werden. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Web Fonts in ihren Browsercache, um Texte und Schriftarten korrekt anzuzeigen. Wenn Ihr Browser Web Fonts nicht unterstützt, wird eine Standardschrift von Ihrem Computer genutzt.

        Weitere Informationen zu Google Web Fonts finden Sie unter https://developers.google.com/fonts/faq und in der Datenschutzerklärung von Google: https://www.google.com/policies/privacy/
      </LegalSection>

      <LegalSection title="Google Tag Manager">
        Google Tag Manager ist eine Lösung, mit der wir sog. Website-Tags über eine Oberfläche verwalten können und so z.B. Google Analytics sowie andere Google-Marketing-Dienste in unser Onlineangebot einbinden können. Der Tag Manager selbst, welcher die Tags implementiert, verarbeitet keine personenbezogenen Daten der Nutzer. Im Hinblick auf die Verarbeitung der personenbezogenen Daten der Nutzer wird auf die folgenden Angaben zu den Google-Diensten verwiesen. Nutzungsrichtlinien: https://www.google.com/intl/de/tagmanager/use-policy.html.
      </LegalSection>

      <LegalSection title="Hotjar">
        Diese Website benutzt den Service von Hotjar zur Verbesserung der Benutzerfreundlichkeit. Die Hotjar Ltd. ist ein europäisches Unternehmen mit Sitz in Malta (Hotjar Ltd, Level 2, St Julians Business Centre, 3, Elia Zammit Street, St Julians STJ 1000, Malta, Europe). Es können Mausklicks sowie Maus- und Scroll-Bewegungen aufgezeichnet werden. Ebenso können auf dieser Internetseite durchgeführte Tastatureingaben aufgezeichnet werden. Personifizierte Informationen werden dabei nicht aufgenommen. Hotjar verwendet zur Erhebung und Übertragung Ihrer Daten einen Tracking-Code. Sobald Sie unsere Website besuchen, erhebt der Hotjar Tracking-Code automatisch die auf Ihrer Aktivität beruhenden Daten und speichert Sie auf den Hotjar Servern (Standort Irland) ab. Zudem erheben die durch die Website auf Ihrem Computer oder Ihrem Endendgerät platzierten Cookies ebenfalls Daten. Für weitere Informationen, wie Hotjar arbeitet, besuchen Sie diese Seite: https://www.hotjar.com/privacy.

        Möchten Sie der Erhebung der Daten durch Hotjar widersprechen (Opt-Out), klicken Sie bitte hier: https://www.hotjar.com/opt-out.
      </LegalSection>

      <LegalSection title="Facebook">
        Diese Website verwendet Funktionen von Facebook Inc., 1601 S. California Ave, Palo Alto, CA 94304, USA. Bei Aufruf unserer Seiten mit Facebook-Plug-Ins wird eine Verbindung zwischen Ihrem Browser und den Servern von Facebook aufgebaut. Dabei werden bereits Daten an Facebook übertragen. Besitzen Sie einen Facebook-Account, können diese Daten damit verknüpft werden. Wenn Sie keine Zuordnung dieser Daten zu Ihrem Facebook-Account wünschen, loggen Sie sich bitte vor dem Besuch unserer Seite bei Facebook aus. Interaktionen, insbesondere das Nutzen einer Kommentarfunktion oder das Anklicken eines "Like"- oder "Teilen"-Buttons werden ebenfalls an Facebook weitergegeben. Mehr erfahren Sie unter https://de-de.facebook.com/about/privacy.
      </LegalSection>

      <LegalSection title="Instagram">
        Auf unseren Seiten sind Funktionen des Dienstes Instagram eingebunden. Diese Funktionen werden angeboten durch die Instagram Inc., 1601 Willow Road, Menlo Park, CA, 94025, USA integriert. Wenn Sie in Ihrem Instagram-Account eingeloggt sind können Sie durch Anklicken des Instagram-Buttons die Inhalte unserer Seiten mit Ihrem Instagram-Profil verlinken. Dadurch kann Instagram den Besuch unserer Seiten Ihrem Benutzerkonto zuordnen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch Instagram erhalten.

        Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von Instagram: http://instagram.com/about/legal/privacy/
      </LegalSection>

      <LegalSection title="LinkedIn">
        Diese Website nutzt Funktionen des Netzwerks LinkedIn. Anbieter ist die LinkedIn Corporation, 2029 Stierlin Court, Mountain View, CA 94043, USA. Bei jedem Abruf einer unserer Seiten, die Funktionen von LinkedIn enthält, wird eine Verbindung zu Servern von LinkedIn aufbaut. LinkedIn wird darüber informiert, dass Sie unsere Internetseiten mit Ihrer IP-Adresse besucht haben. Wenn Sie den "Recommend-Button" von LinkedIn anklicken und in Ihrem Account bei LinkedIn eingeloggt sind, ist es LinkedIn möglich, Ihren Besuch auf unserer Internetseite Ihnen und Ihrem Benutzerkonto zuzuordnen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch LinkedIn haben.

        Weitere Informationen hierzu finden Sie in der Datenschutzerklärung von LinkedIn unter: https://www.linkedin.com/legal/privacy-policy
      </LegalSection>

      <LegalSection title="Newsletter – Mailchimp">
        Der Versand der Newsletter erfolgt mittels des Versanddienstleisters 'MailChimp', einer Newsletterversandplattform des US-Anbieters Rocket Science Group, LLC, 675 Ponce De Leon Ave NE #5000, Atlanta, GA 30308, USA. Die Datenschutzbestimmungen des Versanddienstleisters können Sie hier einsehen. The Rocket Science Group LLC d/b/a MailChimp ist unter dem Privacy-Shield-Abkommen zertifiziert und bietet hierdurch eine Garantie, das europäisches Datenschutzniveau einzuhalten (PrivacyShield). Der Versanddienstleister wird auf Grundlage unserer berechtigten Interessen gem. Art. 6 Abs. 1 lit. f DSGVO und eines Auftragsverarbeitungsvertrages gem. Art. 28 Abs. 3 S. 1 DSGVO eingesetzt.

        Der Versanddienstleister kann die Daten der Empfänger in pseudonymer Form, d.h. ohne Zuordnung zu einem Nutzer, zur Optimierung oder Verbesserung der eigenen Services nutzen, z.B. zur technischen Optimierung des Versandes und der Darstellung der Newsletter oder für statistische Zwecke verwenden. Der Versanddienstleister nutzt die Daten unserer Newsletterempfänger jedoch nicht, um diese selbst anzuschreiben oder um die Daten an Dritte weiterzugeben.
      </LegalSection>

      <LegalSection title="YouTube">
        Diese Website nutzt Plugins der von Google betriebenen Seite YouTube. Betreiber der Seiten ist die YouTube, LLC, 901 Cherry Ave., San Bruno, CA 94066, USA. Wenn Sie eine unserer mit einem YouTube-Plugin ausgestatteten Seiten besuchen, wird eine Verbindung zu den Servern von YouTube hergestellt. Dabei wird dem Youtube-Server mitgeteilt, welche unserer Seiten Sie besucht haben.

        Wenn Sie in Ihrem YouTube-Account eingeloggt sind ermöglichen Sie YouTube, Ihr Surfverhalten direkt Ihrem persönlichen Profil zuzuordnen. Dies können Sie verhindern, indem Sie sich aus Ihrem YouTube-Account ausloggen.

        Weitere Informationen zum Umgang von Nutzerdaten finden Sie in der Datenschutzerklärung von YouTube unter: https://www.google.de/intl/de/policies/privacy
      </LegalSection>

      <LegalSection title="Maklerleistungen">
        Wir verarbeiten die Daten unserer Kunden, Klienten und Interessenten (einheitlich bezeichnet als «Kunden») gem. den datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) und der EU-DSGVO entsprechend Art. 6 Abs. 1 lit. b. DSGVO, um ihnen gegenüber unsere vertraglichen oder vorvertraglichen Leistungen zu erbringen. Die hierbei verarbeiteten Daten, die Art, der Umfang und der Zweck und die Erforderlichkeit ihrer Verarbeitung bestimmen sich nach dem zugrundeliegenden Auftrag. Dazu gehören grundsätzlich Bestands- und Stammdaten der Kunden (Name, Adresse, etc.), als auch die Kontaktdaten (E-Mailadresse, Telefon, etc.), die Vertragsdaten (Inhalt der Beauftragung, Entgelte, Laufzeiten, Angaben zu den vermittelten Unternehmen/ Versicherern/ Leistungen) und Zahlungsdaten (Provisionen, Zahlungshistorie, etc.). Wir können ferner die Angaben zu den Eigenschaften und Umständen von Personen oder ihnen gehörenden Sachen verarbeiten, wenn dies zum Gegenstand unseres Auftrags gehört. Dies können z.B. Angaben zu persönlichen Lebensumständen, mobilen oder immobilen Sachgütern sein.

        Im Rahmen unserer Beauftragung kann es auch erforderlich sein, dass wir besondere Kategorien von Daten gem. Art. 9 Abs. 1 DSGVO, hier insbesondere Angaben zur Gesundheit einer Person verarbeiten. Hierzu holen wir, sofern erforderlich, gem. Art. 6 Abs. 1 lit a., Art. 7, Art. 9 Abs. 2 lit. a DSGVO eine ausdrückliche Einwilligung der Kunden ein.

        Sofern für die Vertragserfüllung oder gesetzlich erforderlich, offenbaren oder übermitteln wir die Daten der Kunden im Rahmen von Deckungsanfragen, Abschlüssen und Abwicklungen von Verträgen, Daten an Anbieter der vermittelten Leistungen/ Objekte, Versicherer, Rückversicherer, Maklerpools, technische Dienstleister, sonstige Dienstleister, wie z.B. kooperierende Verbände, sowie Finanzdienstleister, Kreditinstitute und Kapitalanlagegesellschaften sowie Sozialversicherungsträger, Steuerbehörden, Steuerberater, Rechtsberater, Wirtschaftsprüfer, Versicherungs-Ombudsmänner und die Schweizerische Finanzmarkt-Aufsicht (FINMA) oder Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin). Ferner können wir Unterauftragnehmer beauftragen, wie z.B. Untervermittler. Wir holen eine Einwilligung der Kunden ein, sofern diese zur Offenbarung/ Übermittlung eine Einwilligung der Kunden erforderlich ist (was z.B. im Fall von besonderen Kategorien von Daten gem. Art. 9 DSGVO der Fall sein kann).

        Die Löschung der Daten erfolgt nach Ablauf gesetzlicher Gewährleistungs- und vergleichbarer Pflichten, wobei die Erforderlichkeit der Aufbewahrung der Daten in unregelmässigen Abständen überprüft wird. Im Übrigen gelten die gesetzlichen Aufbewahrungspflichten. Im Fall der gesetzlichen Archivierungspflichten erfolgt die Löschung nach deren Ablauf.
      </LegalSection>

      <LegalSection title="Vertragliche Leistungen">
        Wir verarbeiten die Daten unserer Vertragspartner und Interessenten sowie anderer Auftraggeber, Kunden, Mandanten, Klienten oder Vertragspartner (einheitlich bezeichnet als «Vertragspartner») gem. den datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) und der EU-DSGVO entsprechend Art. 6 Abs. 1 lit. b. DSGVO, um ihnen gegenüber unsere vertraglichen oder vorvertraglichen Leistungen zu erbringen. Die hierbei verarbeiteten Daten, die Art, der Umfang und der Zweck und die Erforderlichkeit ihrer Verarbeitung, bestimmen sich nach dem zugrundeliegenden Vertragsverhältnis.

        Zu den verarbeiteten Daten gehören die Stammdaten unserer Vertragspartner (z.B. Namen und Adressen), Kontaktdaten (z.B. E-Mailadressen und Telefonnummern) sowie Vertragsdaten (z.B. in Anspruch genommene Leistungen, Vertragsinhalte, vertragliche Kommunikation, Namen von Kontaktpersonen) und Zahlungsdaten (z.B. Bankverbindungen, Zahlungshistorie).

        Besondere Kategorien personenbezogener Daten verarbeiten wir grundsätzlich nicht, ausser wenn diese Bestandteile einer beauftragten oder vertragsgemässen Verarbeitung sind.

        Wir verarbeiten Daten, die zur Begründung und Erfüllung der vertraglichen Leistungen erforderlich sind und weisen auf die Erforderlichkeit ihrer Angabe, sofern diese für die Vertragspartner nicht evident ist, hin. Eine Offenlegung an externe Personen oder Unternehmen erfolgt nur, wenn sie im Rahmen eines Vertrags erforderlich ist. Bei der Verarbeitung der uns im Rahmen eines Auftrags überlassenen Daten, handeln wir entsprechend den Weisungen der Auftraggeber sowie der gesetzlichen Vorgaben.

        Im Rahmen der Inanspruchnahme unserer Onlinedienste, können wir die IP-Adresse und den Zeitpunkt der jeweiligen Nutzerhandlung speichern. Die Speicherung erfolgt auf Grundlage unserer berechtigten Interessen, als auch der Interessen der Nutzer am Schutz vor Missbrauch und sonstiger unbefugter Nutzung. Eine Weitergabe dieser Daten an Dritte erfolgt grundsätzlich nicht, ausser sie ist zur Verfolgung unserer Ansprüche gem. Art. 6 Abs. 1 lit. f. DSGVO erforderlich oder es besteht hierzu eine gesetzliche Verpflichtung gem. Art. 6 Abs. 1 lit. c. DSGVO.

        Die Löschung der Daten erfolgt, wenn die Daten zur Erfüllung vertraglicher oder gesetzlicher Fürsorgepflichten sowie für den Umgang mit etwaigen Gewährleistungs- und vergleichbaren Pflichten nicht mehr erforderlich sind, wobei die Erforderlichkeit der Aufbewahrung der Daten in unregelmässigen Abständen überprüft wird. Im Übrigen gelten die gesetzlichen Aufbewahrungspflichten.
      </LegalSection>

      <LegalSection title="Erbringung unserer Leistungen nach Statuten">
        Wir verarbeiten die Daten unserer Mitglieder, Unterstützer, Interessenten, Kunden oder sonstiger Personen gem. den datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) und der EU-DSGVO entsprechend Art. 6 Abs. 1 lit. b. DSGVO, sofern wir ihnen gegenüber vertragliche Leistungen anbieten oder im Rahmen bestehender geschäftlicher Beziehung, z.B. gegenüber Mitgliedern, tätig werden oder selbst Empfänger von Leistungen und Zuwendungen sind. Im Übrigen verarbeiten wir die Daten betroffener Personen gem. Art. 6 Abs. 1 lit. f. DSGVO auf Grundlage unserer berechtigten Interessen, z.B. wenn es sich um administrative Aufgaben oder Öffentlichkeitsarbeit handelt.

        Die hierbei verarbeiteten Daten, die Art, der Umfang und der Zweck und die Erforderlichkeit ihrer Verarbeitung bestimmen sich nach dem zugrundeliegenden Vertragsverhältnis. Dazu gehören grundsätzlich Bestands- und Stammdaten der Personen (z.B., Name, Adresse, etc.), als auch die Kontaktdaten (z.B., E-Mailadresse, Telefon, etc.), die Vertragsdaten (z.B., in Anspruch genommene Leistungen, mitgeteilte Inhalte und Informationen, Namen von Kontaktpersonen) und sofern wir zahlungspflichtige Leistungen oder Produkte anbieten, Zahlungsdaten (z.B., Bankverbindung, Zahlungshistorie, etc.).

        Wir löschen Daten, die zur Erbringung der statutarischen Zwecke nicht mehr erforderlich sind. Dies bestimmt sich entsprechend der jeweiligen Aufgaben und vertraglichen Beziehungen. Im Fall geschäftlicher Verarbeitung bewahren wir die Daten so lange auf, wie sie zur Geschäftsabwicklung, als auch im Hinblick auf etwaige Gewährleistungs- oder Haftungspflichten relevant sein können. Die Erforderlichkeit der Aufbewahrung der Daten wird in unregelmässigen Abständen überprüft. Im Übrigen gelten die gesetzlichen Aufbewahrungspflichten.
      </LegalSection>

      <LegalSection title="Urheberrechte">
        Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf der Website, gehören ausschliesslich dem Betreiber dieser Website oder den speziell genannten Rechteinhabern. Für die Reproduktion von sämtlichen Dateien, ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.

        Wer ohne Einwilligung des jeweiligen Rechteinhabers eine Urheberrechtsverletzung begeht, kann sich strafbar und allenfalls schadenersatzpflichtig machen.
      </LegalSection>

      <p className="pt-6 text-sm text-muted-foreground">Rothenburg, 01.06.2024</p>
    </LegalLayout>
  );
}