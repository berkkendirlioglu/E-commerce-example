export function isTokenExpired(token: string) {
  // access token içindeki payload'ı atob ile decode ediyoruz ve parse hale getiriyoruz
  const Payload = decodeToken(token);

  // exp süresi direkt epoch hale çevrildiğinde saniye olarak geliyor bunu 1000 ile çarpıp milisaniye cinsine çeviriyoruz ve doğru tarihi getiriyoruz.
  const expDate = new Date(Payload.exp * 1000);

  // şuanki tarih
  const currentDate = new Date();

  // access token zamanının geçip geçmediğini sorguluyoruz (true or false)
  const isPast = expDate < currentDate;

  return isPast;
}

export function decodeToken(token: string) {
  const Payload = JSON.parse(atob(token.split(".")[1])) as {
    exp: number;
    iat: number;
    sub: number;
  };

  return Payload;
}
