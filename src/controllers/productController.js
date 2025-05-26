
const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../../uploads/produtos');

// Certifica que o diretório de uploads existe
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.json(product);
    } catch (error) {
        console.error('Erro ao buscar produto por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        let imageUrl = null;

        if (req.file) {
            // O multer já cuidou de salvar o arquivo no destino
            // O caminho da imagem será '/uploads/produtos/nome_do_arquivo.ext'
            imageUrl = `/uploads/produtos/${req.file.filename}`;
        }

        const newProduct = await Product.create(name, description, price, imageUrl);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        // Se houve um erro e um arquivo foi uploadado, tente removê-lo
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erro ao remover arquivo:', err);
            });
        }
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const productId = req.params.id;
        let imageUrl = req.body.currentImageUrl; // Pega a URL existente do corpo da requisição

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        if (req.file) {
            // Se uma nova imagem foi enviada, delete a antiga se existir
            if (existingProduct.image_url && existingProduct.image_url.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '../../', existingProduct.image_url);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Erro ao remover imagem antiga:', err);
                });
            }
            imageUrl = `/uploads/produtos/${req.file.filename}`;
        } else if (req.body.removeImage === 'true') {
            // Se o frontend solicitou para remover a imagem
            if (existingProduct.image_url && existingProduct.image_url.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '../../', existingProduct.image_url);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Erro ao remover imagem:', err);
                });
            }
            imageUrl = null; // Remove a URL do banco de dados
        } else {
            // Se nenhuma nova imagem foi enviada e não foi solicitada a remoção, mantém a imagem existente
            imageUrl = existingProduct.image_url;
        }


        const updated = await Product.update(productId, name, description, price, imageUrl);

        if (updated) {
            res.json({ message: 'Produto atualizado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado ou nenhum dado para atualizar.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        if (req.file) { // Se houve um erro e um arquivo foi uploadado, tente removê-lo
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Erro ao remover arquivo:', err);
            });
        }
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        // Se o produto tiver uma imagem, remove-a do disco
        if (existingProduct.image_url && existingProduct.image_url.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '../../', existingProduct.image_url);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Erro ao remover imagem ao deletar produto:', err);
            });
        }

        const deleted = await Product.delete(productId);
        if (deleted) {
            res.json({ message: 'Produto deletado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};