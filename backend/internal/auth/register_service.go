package auth

import (
	"time"
	// "fmt"
	"new-e-power-generator-sys/inventory/internal/shared/database"
	"new-e-power-generator-sys/inventory/internal/shared/email"
)

type EmailVerify struct {
	Email string `json:"email"`
	URL   string `json:"url"`
	Expiry time.Time `json:"expiry"`
}

var EmailVerifyValidity []EmailVerify

func GenerateEmailVerify(email, baseURL string, validityPeriod time.Duration) EmailVerify {
	expiry := time.Now().Add(validityPeriod)
	verifyURL := baseURL + "?email=" + email
	EmailVerifyValidity = append(EmailVerifyValidity, EmailVerify{
		Email: email,
		URL:   verifyURL,
		Expiry: expiry,
	})
	return EmailVerify{
		Email: email,
		URL:   verifyURL,
		Expiry: expiry,
	}
}

func SendEmailVerify(emailVerify EmailVerify) error {
	subject := "Email Verification"
	body := "Please verify your email by clicking the following link: " + emailVerify.URL + "\nThis link will expire at: " + emailVerify.Expiry.Format(time.RFC1123)
	SMTPSender := email.NewSMTPSender(email.SMTPConfigVar)
	return SMTPSender.SendEmail(emailVerify.Email, subject, body)
}

func EmailVerifyCheck(email string) (bool, error) {
	verifyb := false
	for _, verify := range EmailVerifyValidity {
		if verify.Email == email && time.Now().Before(verify.Expiry) {
			EmailVerifyUpdate(email)
			verifyb = true
		}
	}
	if verifyb {
		//remove used verify
		for i, verify := range EmailVerifyValidity {
			if verify.Email == email {
				EmailVerifyValidity = append(EmailVerifyValidity[:i], EmailVerifyValidity[i+1:]...)
				break
			}
		}
		return true, nil
	}
	return false, nil
}

func EmailVerifyUpdate(email string) error {
	err := database.UserCheckedEmailByEmail(email)
	if err != nil {
		return err
	}
	return nil
}

func RegisterUser(newUser database.User, password string, baseUrl string) error {
	err := database.UserRegister(
		newUser,
		password,
	)
	if err != nil {
		return err
	}
	// generate email verify
	emailVerifyE := GenerateEmailVerify(newUser.Email, baseUrl, 5*time.Minute)
	// send email verify
	err = SendEmailVerify(emailVerifyE)
	if err != nil {
		return err
	}
	return nil
}