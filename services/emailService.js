import settings from "../appConfig/config.js";
import {
  renderTable
} from "./uiService.js";
import {
  userData
} from "./userService.js";

export const promoKeywords = [
  "offer",
  "special offer",
  "exclusive offer",
  "discount",
  "discount code",
  "promo code",
  "coupon",
  "code inside",
  "your code",
  "save %",
  "% off",
  "off",
  "deal",
  "deal inside",
  "flash sale",
  "today only",
  "last chance",
  "final hours",
  "ends tonight",
  "ending soon",
  "limited time",
  "hurry",
  "exclusive",
  "for you",
  "just for you",
  "vip",
  "VIP",
  "members only",
  "early access",
  "free shipping",
  "buy one get one",
  "bogo",
  "gift with purchase",
  "your reward",
  "save big",
  "massive sale",
  "clearance",
  "up to % off",
  "sale starts now",
  "sale ends soon",
  "discount applied at checkout",
  "unlock savings",
  "unlock discount",
  "code revealed inside",
  "just for subscribers",
  "thank you – here’s a code",
  "welcome – here’s % off",
  "new subscriber % off",
  "we miss you – 20% off",
  "cart reminder – discount",
  "free gift",
  "gift inside",
  "members special",
  "back in stock – sale",
  "early bird discount",
  "exclusive access",
  "private sale",
  "secret sale",
  "you’re invited",
  "limited stock",
  "deal ends soon",
  "today only offer",
  "only hours left",
  "hours left to save",
  "time-sensitive offer",
  "act now",
  "open now for discount",
  "open now for savings",
  "we’ve reserved this for you",
  "just for you – discount",
  "unbeatable price",
  "steep discount",
  "lowest price ever",
  "flash offer",
  "while stocks last",
  "once in a lifetime deal",
  "special saving",
  "instant savings",
  "biggest sale ever",
  "extra % off",
  "extra discount",
  "double discount",
  "limited edition sale",
  "exclusive deal inside",
  "insider deal",
  "vip only offer",
  "members only discount",
  "price drop",
  "reduced prices",
  "% off everything",
  "everything must go",
  "doorbuster deal",
  "today’s deal",
  "deal of the day",
  "save more",
  "save now",
  "locked in savings",
  "code inside for you",
  "redeem code now",
  "redeem your discount",
  "redeem your code",
  "discount unlocked",
  "unlock this offer",
  "secret code inside",
  "limited time code",
  "code expires",
  "expires tonight",
  "ends midnight",
  "ends today",
  "final call – sale",
  "last chance to shop",
  "shop now and save",
  "shop early & save",
  "pre-sale discount",
  "early access savings",
  "invite only sale",
  "member exclusive",
  "just for our VIPs",
  "thank you – enjoy this offer",
  "because you subscribe – discount",
  "your subscriber discount",
  "hello subscriber – % off"
];

export async function getCurrentUserData(activeAccountToken) {
  const headers = new Headers({
    "Authorization": `Bearer ${activeAccountToken.accessToken}`
  });

  const options = {
    method: "GET",
    headers: headers
  };

  return (await fetch(`${settings.apiBaseUrl}/me`, options)).json();
}

export async function getInboxMessages() {
  const options = {
    method: "GET",
    headers: new Headers({
      "Authorization": `Bearer ${userData.accessToken}`
    }),
  };

  return (await fetch(`${settings.apiBaseUrl}/me/mailfolders/inbox/messages?$select=subject,from,receivedDateTime&$top=1000&$orderby=receivedDateTime%20DESC`, options)).json();
}

export function getPromotions(inboxMessages) {
  if (inboxMessages.value.length <= 0) {
    throw new Error("No inbox messages present");
  }

  let i = 0;

  inboxMessages.value.forEach((inboxMessage) => {
    const subject = inboxMessage.subject.toLowerCase();
    const isPromo = promoKeywords.some((keyword) => subject.includes(keyword));

    if (isPromo) {
      userData.promotions.push({
        id: ++i,
        emailId: inboxMessage.id,
        sender: inboxMessage.from.emailAddress.name,
        subject: inboxMessage.subject,
        receivedAt: `${inboxMessage.receivedDateTime.split('T')[0]} ${inboxMessage.receivedDateTime.split('T')[1]}`
      })
    }
  });

  return userData.promotions;
}

export async function getMessage(promotion) {
  const options = {
    method: "GET",
    headers: new Headers({
      "Authorization": `Bearer ${userData.accessToken}`
    }),
  };

  const message = await (await fetch(`${settings.apiBaseUrl}/me/messages/${promotion.emailId}`, options)).json();

  promotion.messageContent = message.body.content;
  promotion.link = message.webLink;
}

export function searchPromotions(value) {
  const searchResult = userData.promotions.filter((promotion) => promotion.sender.toLowerCase().includes(value.toLowerCase()));
  renderTable(searchResult);
}