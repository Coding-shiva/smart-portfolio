import Certificate from '../models/Certificate.js';

export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({}).sort({ issueDate: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCertificate = async (req, res) => {
  const { title, issuer, issueDate, credentialId, credentialUrl, image } = req.body;

  try {
    const certificate = new Certificate({
      title,
      issuer,
      issueDate,
      credentialId,
      credentialUrl,
      image,
    });

    const createdCertificate = await certificate.save();
    res.status(201).json(createdCertificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  const { title, issuer, issueDate, credentialId, credentialUrl, image } = req.body;

  try {
    const certificate = await Certificate.findById(req.params.id);

    if (certificate) {
      certificate.title = title ?? certificate.title;
      certificate.issuer = issuer ?? certificate.issuer;
      certificate.issueDate = issueDate ?? certificate.issueDate;
      certificate.credentialId = credentialId ?? certificate.credentialId;
      certificate.credentialUrl = credentialUrl ?? certificate.credentialUrl;
      certificate.image = image ?? certificate.image;

      const updatedCertificate = await certificate.save();
      res.json(updatedCertificate);
    } else {
      res.status(404).json({ message: 'Certificate not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (certificate) {
      await certificate.deleteOne();
      res.json({ message: 'Certificate removed' });
    } else {
      res.status(404).json({ message: 'Certificate not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
