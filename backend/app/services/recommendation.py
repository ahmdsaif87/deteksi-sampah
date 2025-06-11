def get_recommendation(label: str) -> str:
    mapping = {
        "organik": "Gunakan untuk kompos atau makanan hewan.",
        "plastik": "Cuci dan jual ke bank sampah.",
        "logam": "Kumpulkan untuk dijual ke pengepul.",
        "kaca": "Pisahkan agar tidak melukai orang.",
        "anorganik": "Pertimbangkan upcycling jadi kerajinan."
    }
    return mapping.get(label, "Belum ada rekomendasi.")
