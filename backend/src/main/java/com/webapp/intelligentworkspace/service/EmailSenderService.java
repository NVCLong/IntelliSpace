package com.webapp.intelligentworkspace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service

public class EmailSenderService {
    @Autowired

    private JavaMailSender mailSender;

    public void sendEmail(String toEmail,
                          String subject,
                          String body){

        SimpleMailMessage mailMessage= new SimpleMailMessage();
        mailMessage.setFrom("intellispace.contact@gmail.com");
        mailMessage.setTo(toEmail);
        mailMessage.setText(body);
        mailMessage.setSubject(subject);

        mailSender.send(mailMessage);
        System.out.println("Mail sent successfully.....");

    }


}
