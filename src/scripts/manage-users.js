const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../api-go/serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("❌ ERROR: No se encontró el archivo serviceAccountKey.json en src/api-go/");
  process.exit(1);
}

const action = process.argv[2]; 
const email = process.argv[3];
const arg4 = process.argv[4]; // password or role
const arg5 = process.argv[5]; // role for creation

async function main() {
  if (!action || !email) {
    console.log(`
Uso: 
  node manage-users.js create-user <email> <password> <role>
  node manage-users.js reset-password <email> <new-password>
  node manage-users.js set-role <email> <role>
  node manage-users.js get-role <email>
    `);
    return;
  }

  try {
    let user;
    
    if (action === 'create-user') {
      const password = arg4;
      const role = arg5 || 'player';
      
      try {
        user = await admin.auth().createUser({ email, password });
        console.log(`✅ Usuario creado: ${email} (UID: ${user.uid})`);
      } catch (e) {
        if (e.code === 'auth/email-already-exists') {
          user = await admin.auth().getUserByEmail(email);
          console.log(`ℹ️ El usuario ya existe.`);
        } else {
          throw e;
        }
      }
      await admin.auth().setCustomUserClaims(user.uid, { role });
      console.log(`✅ Rol '${role}' asignado.`);
    }

    if (action === 'reset-password') {
      user = await admin.auth().getUserByEmail(email);
      await admin.auth().updateUser(user.uid, { password: arg4 });
      console.log(`✅ Contraseña actualizada correctamente para ${email}`);
    }

    if (action === 'set-role') {
      user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, { role: arg4 });
      console.log(`✅ Rol '${arg4}' asignado a ${email}`);
    }

    if (action === 'get-role') {
      user = await admin.auth().getUserByEmail(email);
      const updatedUser = await admin.auth().getUser(user.uid);
      console.log(`🔍 Claims actuales para ${email}:`, updatedUser.customClaims || "Ninguno");
    }

  } catch (error) {
    console.error("❌ ERROR:", error.message);
  } finally {
    process.exit();
  }
}

main();
