const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const adminApp = initializeApp({
  credential: cert({
    projectId: "mentorhive-52319",
    clientEmail:
      "firebase-adminsdk-170a4@mentorhive-52319.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC0UAkTy0nOX1G4\nB7Ph99hE83A5DYpk3iPirxb8iFd4epdcjxWLSyoZ43JE/NIE40DGUq8hAVEZNiUs\nEuP8cdOL7WZmwXoIcMU/bPZ88f/leRttFlCYRS+o+GRzz0Shdd+uhEMJQCTyGp24\nATO7dKmRcL3fJKM28AtlW8ffX5SAdlWpS8iBFJsIzPPY4+tjgZvv3rwZTVwMXMlF\nBPydBrKbmJpL9E6En83URfhcCieU6GQP2BNWdOKDuajNs1dhxky1ITAwMcuqPWeL\nVDKCUPyiMg609oPRrxH00vE2DP9JG8herVPweHTMUrnNAPN2sddc3b64Z65ZXn8q\nDzw7L0YJAgMBAAECggEACFV7hxDlhMH8X92gat9hD6iAfpFuJgTr10IjvnxxUolv\nbfNBoykHIzJ38ogxM/YzibunChlF+2FmWpNa8YhquXQnUpAWSOqV/ZiyCvh930hA\nxDChM/44Wn50j9e71PgL9tbBsiZnCi3lLdqFgzu8XcosIimFs677Brd+VT8MC0lP\nxqWn5MFRaWuULpedIoVrNiBrFxG2pPGgTLc8qfbOjITLLXpeJGIRVsizZnmoMAyH\nu2uzWZ8GIl0u1rXBA/bPNweBPqnwaZmSDZiSBVvel89vsdZCDpXqR+qhhxZfOP5l\nADGlQJuMEzpMjQNsHhRTCl/Ih89q37B4SBkhjVArYwKBgQDuOvM3Va4HHuuhVyD6\nti0V6sLpYm2R1M1HOy60sD+BRp8oRMBJwRFcR1wK3YVhrJAkQlpvDauLaMv7bykV\nOg/SgMfe83zeDwniUvAEpwXcNqhJ5RjNHzXpSYjY+YyrsGMmBupakQgpJxtUFOm7\nR2LpjnZUxaSpCQHsV1RSOUf2qwKBgQDBwyNCXIQNmy+fSrSgPoVzIhkkgEtlFRLv\n9/7Q1U9KNkXUbZzWIIKwelXa5fQNeU38tutIQdlNz+IQQpgeKezK+kTakJJa9us6\nxfFCidZA3tZf5ZimdyuzXxIrQ4fN0+bMLQ0oeWU9JWMS4XZ2TX2q1HlEOpdgsGUs\nG7vX13DGGwKBgQDGyU312HrU2kpIYMnWKnnIlhJ6aHWBgI6iZ5H7mC4Fk4ZvNZ82\na/IujCUTs/D+pd3JQ8zuafvA4nuDnSgs3DwjrO4a7hY9vVLEFezOFQjgzoLy1kYx\ns19rAL8+Pk3RXef97TtUwzyKCmXVbXXznge9V/EJn7pcinWeXuivi7iu7QKBgQCO\n5qoEcVL67e7rXh9k53doeEduwifYvvgefxoxToCRzQEnMEgxK/z2xuK29E1P+pzn\nusg/nED1wFGLiHHEHUuET5ukTmeCKwVFbWMHnbykTzRvuVchvlY+jelKex2XUaaw\nArHnndBqjj5JWHsTuQbrjJR7G3M1XiLfqvyYrU2A7QKBgQChpzF/LVZCeeednttB\nBPHD1+dWqlbZmPWgms1VDCnKuzhwmGWNHXREu1be5Vzp/xx+VT/rxdsT4oIxnkkQ\nOE3oFoQsFkZH3XU5VXVOlcCIHWBWU8x47/d1+waPen77cGbo8miaOzjWEzvf/V/4\nXLdgKVX0DIt2V0op0nFUXUn6ow==\n-----END PRIVATE KEY-----\n",
  }),
  storageBucket: "mentorhive-52319.firebasestorage.app",
});

const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

module.exports = { db, auth };
