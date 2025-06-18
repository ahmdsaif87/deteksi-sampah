def get_recommendation(label: str) -> dict:
    mapping = {
        "cardboard": {
            "deskripsi": "Kardus bekas dari kemasan, biasanya berbahan dasar kertas tebal.",
            "cara_penanganan": [
                "Lipat agar hemat tempat.",
                "Pastikan kering dan bersih dari minyak atau makanan.",
                "Kumpulkan dan jual ke pengepul atau bank sampah."
            ],
            "catatan": "Kardus basah atau berminyak sulit didaur ulang."
        },
        "glass": {
            "deskripsi": "Sampah kaca seperti botol, gelas, dan pecahan jendela.",
            "cara_penanganan": [
                "Pisahkan berdasarkan warna (jika bisa).",
                "Bersihkan dari sisa cairan.",
                "Jangan campur dengan jenis lain.",
                "Bawa ke tempat pengumpulan kaca."
            ],
            "catatan": "Tangani dengan hati-hati, terutama jika pecah."
        },
        "metal": {
            "deskripsi": "Sampah logam seperti kaleng, aluminium foil, dan besi.",
            "cara_penanganan": [
                "Bersihkan dari makanan atau minyak.",
                "Remas kaleng agar hemat ruang.",
                "Kumpulkan untuk dijual atau didaur ulang."
            ],
            "catatan": "Bisa didaur ulang hampir tanpa batas."
        },
        "paper": {
            "deskripsi": "Kertas bekas seperti koran, majalah, dan print-an.",
            "cara_penanganan": [
                "Pisahkan dari sampah basah.",
                "Gunakan kembali untuk keperluan tulis/cetak ulang.",
                "Daur ulang jika tidak bisa digunakan lagi."
            ],
            "catatan": "Jangan campur dengan sampah makanan atau minyak."
        },
        "plastic": {
            "deskripsi": "Botol, kantong, dan wadah berbahan plastik.",
            "cara_penanganan": [
                "Cuci bersih sebelum disimpan.",
                "Pisahkan berdasarkan jenis (PET, HDPE, dll).",
                "Kumpulkan dan setor ke bank sampah."
            ],
            "catatan": "Jangan bakar plastik! Beracun bagi udara."
        },
        "trash": {
            "deskripsi": "Sampah campuran yang tidak dapat didaur ulang.",
            "cara_penanganan": [
                "Pisahkan dari yang bisa didaur ulang.",
                "Masukkan ke kantong tertutup rapat.",
                "Buang sesuai jadwal dan prosedur pemda setempat."
            ],
            "catatan": "Kurangi jumlah sampah ini dengan memilah lebih baik."
        }
    }

    return mapping.get(label, {
        "deskripsi": "Jenis sampah tidak dikenali.",
        "cara_penanganan": ["Silakan konsultasikan ke ahli lingkungan atau cek kembali data."],
        "catatan": "-"
    })
