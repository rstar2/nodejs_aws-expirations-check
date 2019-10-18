module.exports = (req, res) => {
    const bands = [
        {
            name: 'Dio',
            genre: 'Heavy Metal',
        },
        {
            name: 'Anthrax',
            genre: 'Trash Metal',
        },
        {
            name: 'Tenebrarum',
            genre: 'Gothic Metal',
        },
    ];
    res.json(bands);
};
