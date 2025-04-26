with open ('./Buildings/Buildings.txt', 'w') as file:
    for i in range (701, 747):
        file.write(f"MCKN {i}\n")