import {createTransport} from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuramos el transporte de nodemailer
const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Correo de registro
export const sendRegistrationEmail = (req, res, next) => {
    const emailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: 'Registro exitoso en The Octagon Data',
        html: `
            <h1>¡Bienvenido a The Octagon Data!</h1>
            <p>Hola ${req.body.username},</p>
            <p>Gracias por registrarte en nuestra plataforma. Estamos emocionados de 
            tenerte con nosotros.</p>
            <p>Explora perfiles de luchadores, únete a comunidades y mucho más.</p>
            <p>¡Disfruta de tu experiencia!</p>
            <p>Saludos,<br/>El equipo de The Octagon Data</p>
        `
    }
    transporter.sendMail(emailOptions, (error, info) => {
        if(error){
            console.error('Error al enviar el correo de registro:', error);
            return res.status(500).json({error: 'Error al enviar el correo de registro'});
        }
        next();
    })
}

// Correo de Baneado
export const sendBanEmail = (req, res, next) => {
    const emailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: `Ha sido baneado de la comunidad ${req.body.community_name}`,
        html: `
            <h1>Notificación de Baneo</h1>
            <p>Hola ${req.body.username},</p>
            <p>Le informamos que ha sido baneado de la comunidad 
            <strong>${req.body.community_name}</strong> por la siguiente razón:</p>
            <blockquote>${req.body.banned_text}</blockquote>
            <p>Si cree que esto es un error, por favor contacte con los administradores
            de la comunidad.</p>
            <p>Saludos,<br/>El equipo de The Octagon Data</p>
        `
    }
    transporter.sendMail(emailOptions, (error, info) => {
        if(error){
            console.error('Error al enviar el correo de baneo:', error);
            return res.status(500).json({error: 'Error al enviar el correo de baneo'});
        }
        next();
    })
}

// Correo de Desbaneo
export const sendUnBanEmail = (req, res, next) => {
    const emailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: `Ha sido desbaneado de la comunidad ${req.body.community_name}`,
        html: `
            <h1>Notificación de Desbaneo</h1>
            <p>Hola ${req.body.username},</p>
            <p>Le informamos que ha sido desbaneado de la comunidad 
            <strong>${req.body.community_name}</strong>. Ahora puede volver a participar 
            en las actividades de la comunidad.</p>
            <p>Saludos,<br/>El equipo de The Octagon Data</p>
        `
    }
    transporter.sendMail(emailOptions, (error, info) => {
        if(error){
            console.error('Error al enviar el correo de desbaneo:', error);
            return res.status(500).json({error: 'Error al enviar el correo de desbaneo'});
        }
        next();
    });
}