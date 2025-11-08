package img
import (
	"os"
	"path/filepath"
	"io"
)

func init() {
	const imgDir string = "./img"
	err := EnsureImgDirExists(imgDir)
	if err != nil {
		panic(err)
	}
}

func EnsureImgDirExists(imgDir string) error {
	if _, err := os.Stat(imgDir); os.IsNotExist(err) {
		err := os.MkdirAll(imgDir, os.ModePerm)
		if err != nil {
			return err
		}
	}
	return nil
}


func CopyTmpImg(tmpFilePath string, dstFileDir string) (string, error) {
	dstFileDir = filepath.Join("./img", dstFileDir)
	err := EnsureImgDirExists(dstFileDir)
	if err != nil {
		return "", err
	}
	dstFilePath := filepath.Join(dstFileDir, filepath.Base(tmpFilePath))
	err = os.Rename(tmpFilePath, dstFilePath)
	if err != nil {
		return "", err
	}
	return dstFilePath, nil
}

func TmpImg(file io.Reader, filename string) (string, error) {
	imgDir := "./img/tmp"
	err := EnsureImgDirExists(imgDir)
	if err != nil {
		return "", err
	}
	filePath := filepath.Join(imgDir, filename)
	f, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()
	_, err = io.Copy(f, file)
	if err != nil {
		return "", err
	}
	return filePath, nil
}


func SaveImg(file io.Reader, filename string, dirName string) (string, error) {
	imgDir := "./img/"
	err := EnsureImgDirExists(imgDir)
	if err != nil {
		return "", err
	}
	filePath := filepath.Join(imgDir, filename)
	f, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()
	_, err = io.Copy(f, file)
	if err != nil {
		return "", err
	}
	return filePath, nil
}

func DeleteImg(filename string, dirName string) error {
	imgDir := "./img/"
	if dirName != "" {
		imgDir += dirName + "/"
	}
	filePath := filepath.Join(imgDir, filename)
	err := os.Remove(filePath)
	if err != nil {
		return err
	}
	return nil
}

// funcor {