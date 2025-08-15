import Pin from '../models/Pin.js';

export const getPins = async (req, res) => {
  try {
    const pins = await Pin.find();
    res.json(pins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPin = async (req, res) => {
  try {
    const pin = new Pin(req.body);
    const savedPin = await pin.save();
    res.status(201).json(savedPin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPinById = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);
    if (!pin) {
      return res.status(404).json({ error: 'Pin not found' });
    }
    res.json(pin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePin = async (req, res) => {
  try {
    const pin = await Pin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pin) {
      return res.status(404).json({ error: 'Pin not found' });
    }
    res.json(pin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePin = async (req, res) => {
  try {
    const pin = await Pin.findByIdAndDelete(req.params.id);
    if (!pin) {
      return res.status(404).json({ error: 'Pin not found' });
    }
    res.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};