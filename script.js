import http from "k6/http";

// ===============================================================================

export default function () {
  var url = "http://127.0.0.1:5100/v1/ner-lite";

  let data = {
    text: "In late 2023, the Director of the ACT Land Development Authority advised that two e-mails relating to the upcoming Bonner 3C release were released that may have breached privacy regulations.\n\nThe LDA apologised for the LDA@act.gov.au message “Bonner 3C Block Valuations” having been sent as a group e-mail and advised it was not normal procedure. This action may have breached privacy and the LDA will seek to ensure that this situation does not occur again. Concerned residents should contact the LDA on 0262071923. A separate e-mail from a gmail account was also implicated, with the sender using an account name of “landdevagency@gmail.com”.\n\nThis e-mail address and the sender have no connection to the LDA and have fraudulently purported to represent the LDA. The LDA has contacted the Australian Federal Police in relation to this misrepresentation. This fraudulent e-mail also claimed that the release had been postponed. This is not correct.\n\nAnalysis of Logs and Network traffic captures suggest the email was sent from IP 66.249.77.132. DNS records reveal the IP is related to a Domain owned by Brentan Tarrent (Passport PA5027888) who is listed on the Internation Sanctions list (Consolidated list).",
    model: "gliner",
    verbose: true,
  };

  // Using a JSON string as body
  let res = http.post(url, JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
  console.log(res); // Bert
}
