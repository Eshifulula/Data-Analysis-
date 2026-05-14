const u=JSON.parse(localStorage.getItem('user')||'null');if(!u||u.role!=='admin') location.href='index.html';
