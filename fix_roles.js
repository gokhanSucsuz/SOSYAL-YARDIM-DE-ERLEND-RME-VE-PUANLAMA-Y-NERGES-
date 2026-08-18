const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The lines we want to target are inside the component render function, where `isManager` is available.
// Let's replace `user.role === 'manager'` with `isManager`
// and `user?.role === 'manager'` with `isManager`

// But wait, there are also some outside the render, like line 1134 inside JSX:
// We just do a global replace for the exact patterns, EXCEPT line 1076 where we define `isManager`!

const definitionStr = "const isManager = user.role === 'manager' || user.role === 'superadmin';";
const tempPlaceholder = "___IS_MANAGER_DEF___";
content = content.replace(definitionStr, tempPlaceholder);

content = content.replace(/user\.role === 'manager'/g, 'isManager');
content = content.replace(/user\?\.role === 'manager'/g, 'isManager');

content = content.replace(tempPlaceholder, definitionStr);

// Special fix for line 1134:
// {user.role === 'manager' ? '🔐 Müdür Yetkilisi Yönetim Paneli' : '👤 Personel İnceleme Paneli'}
// becomes
// {isManager ? '🔐 Müdür Yetkilisi Yönetim Paneli' : '👤 Personel İnceleme Paneli'}

// Fix for line 1776: if (user?.role !== 'manager')
content = content.replace(/if \(user\?\.role !== 'manager'\)/g, 'if (!isManager)');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');
