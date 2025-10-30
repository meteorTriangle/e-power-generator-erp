package email

import (
	"crypto/tls"
	"log"

	"gopkg.in/gomail.v2"
)

type EmailSender interface {
	SendEmail(to string, subject string, body string) error
}


type SMTPConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
}


type SMTPSender struct {
	dialer *gomail.Dialer
	from string
}

func NewSMTPSender(config SMTPConfig) *SMTPSender {
	d := gomail.NewDialer(config.Host, config.Port, config.Username, config.Password)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	return &SMTPSender{
		dialer: d,
		from: config.From,
	}
}

func (s *SMTPSender) SendEmail(to string, subject string, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", s.from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	log.Printf("Attempting to send email to %s with subject %s", to, subject)
	if err := s.dialer.DialAndSend(m); err != nil {
		log.Printf("Error sending email to %s: %v", to, err)
		return err
	}
	log.Printf("Email sent to %s seccessfully", to)
	return nil
}

