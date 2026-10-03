// Extrai as iniciais do nome para renderizar o avatar circular
export function obterIniciais(nome) {
  if (!nome) return 'U';
  const partes = nome.trim().split(' ');
  return partes.length > 1
    ? `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase()
    : partes[0].slice(0, 2).toUpperCase();
}

// Retorna cores e tema específicos conforme o cargo do usuário
export function obterTemaCargo(cargo) {
  const c = cargo?.toLowerCase() || '';
  if (c === 'admin') {
    return {
      classe: 'tema-admin',
      label: 'Administrador',
      gradiente: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    };
  }
  if (c.includes('3d') || c.includes('especialista')) {
    return {
      classe: 'tema-3d',
      label: 'Especialista 3D',
      gradiente: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    };
  }
  return {
    classe: 'tema-operador',
    label: 'Operador',
    gradiente: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
  };
}


// Localiza usuário correspondente ao termo informado (nome ou email)
export function encontrarUsuario(termo, lista) {
  const normalizado = termo.trim().toLowerCase();
  return lista.find(
    (u) =>
      u.nome.toLowerCase() === normalizado ||
      (u.email && u.email.toLowerCase() === normalizado) ||
      u.nome.toLowerCase().includes(normalizado)
  );
}
