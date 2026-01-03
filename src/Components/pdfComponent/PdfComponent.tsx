import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { useState } from 'react';

function PdfComponent() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  }

  

  const createPdf = async () => {
    try{
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([600,400])
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      page.drawText('Hello world!', {
        x: 100,
        y: 300,
        size: 24,
        font: font,
        color: rgb(0, 0.53, 0.71),
      })

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'document.pdf'
      link.click()

      URL.revokeObjectURL(url)
    }catch(e){
      console.error('Error creating PDF:', e)
    }
  }

  const editPdf = async () => {
    if (!pdfFile) return;

    try {
      // Чтение файла как ArrayBuffer
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      // Загрузка PDF документа
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Получение первой страницы
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      // Добавление текста на первую страницу
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      firstPage.drawText('Edited with pdf-lib!', {
        x: 50,
        y: 50,
        size: 20,
        font,
        color: rgb(1, 0, 0), // Красный
      });
      
      // Сохранение и скачивание
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'edited-document.pdf';
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error editing PDF:', error);
    }
  }

  const addImageToPdf = async (pdfFile: File, imageFile: File) => {
  try {
    const pdfArrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);
    
    const imageArrayBuffer = await imageFile.arrayBuffer();
    const image = await pdfDoc.embedJpg(imageArrayBuffer); // или embedPng для PNG
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    firstPage.drawImage(image, {
      x: 50,
      y: 500,
      width: 100,
      height: 100,
    });
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error adding image to PDF:', error);
    throw error;
  }
};

  return (
    <>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={createPdf}>Create PDF</button>
      <button onClick={editPdf} disabled={!pdfFile}>
        Редактировать PDF
      </button>

      <input type="file" accept=".jpg, .png" onChange={handleFileChange} />
      <button onClick={() => addImageToPdf(pdfFile!, imageFile!)}>Добавить изображение</button>
    </>
  )
}

export default PdfComponent