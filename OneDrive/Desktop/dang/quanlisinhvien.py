import tkinter as tk
from tkinter import messagebox
import pyodbc

# Kết nối đến cơ sở dữ liệu SQL Server
conn = pyodbc.connect('DRIVER={SQL Server};'
                      'SERVER=your_server_name;'
                      'DATABASE=your_database_name;'
                      'UID=your_username;'
                      'PWD=your_password')

# Tạo bảng nếu chưa tồn tại
def create_tables():
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS Khoa
                      (MaKhoa INT PRIMARY KEY,
                      TenKhoa NVARCHAR(100))''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Nganh
                      (MaNganh INT PRIMARY KEY,
                      TenNganh NVARCHAR(100),
                      MaKhoa INT FOREIGN KEY REFERENCES Khoa(MaKhoa))''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS Lop
                      (MaLop INT PRIMARY KEY,
                      TenLop NVARCHAR(100),
                      MaNganh INT FOREIGN KEY REFERENCES Nganh(MaNganh),
                      KhoaHoc INT,
                      HeDT NVARCHAR(50),
                      NamNhapHoc INT)''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS HocPhan
                      (MaHP INT PRIMARY KEY,
                      TenHP NVARCHAR(100),
                      SoDVHT INT,
                      MaNganh INT FOREIGN KEY REFERENCES Nganh(MaNganh),
                      HocKy NVARCHAR(50))''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS SinhVien
                      (MaSinhVien INT PRIMARY KEY,
                      HoTen NVARCHAR(100),
                      MaLop INT FOREIGN KEY REFERENCES Lop(MaLop),
                      GioiTinh NVARCHAR(10),
                      NgaySinh DATE,
                      DiaChi NVARCHAR(200))''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS DiemHP
                      (MaSinhVien INT FOREIGN KEY REFERENCES SinhVien(MaSinhVien),
                      MaHP INT FOREIGN KEY REFERENCES HocPhan(MaHP),
                      DiemHP FLOAT,
                      PRIMARY KEY (MaSinhVien, MaHP))''')

    cursor.commit()

# Thêm bản ghi vào bảng
def insert_record(table_name, values):
    cursor = conn.cursor()
    placeholders = ','.join(['?' for _ in range(len(values))])
    cursor.execute(f'INSERT INTO {table_name} VALUES ({placeholders})', values)
    cursor.commit()

# Xóa bản ghi khỏi bảng
def delete_record(table_name, key):
    cursor = conn.cursor()
    cursor.execute(f'DELETE FROM {table_name} WHERE ?', (key,))
    cursor.commit()

# Cập nhật bản ghi trong bảng
def update_record(table_name, values, key):
    cursor = conn.cursor()
    set_values = ','.join([f'{column}=?' for column in values.keys()])
    cursor.execute(f'UPDATE {table_name} SET {set_values} WHERE ?', (*values.values(), key))
    cursor.commit()

# Xem tất cả các bản ghi trong bảng
def view_records(table_name):
    cursor = conn.cursor()
    cursor.execute(f'SELECT * FROM {table_name}')
    records = cursor.fetchall()
    return records

def populate_list(table_name):
    records_list.delete(0, tk.END)
    records = view_records(table_name)
    for record in records:
        records_list.insert(tk.END, record)

def add_record():
    if not all(entry.get() for entry in entry_fields):
        messagebox.showerror('Missing Information', 'Please fill in all fields')
        return
    values = [entry.get() for entry in entry_fields]
    insert_record(selected_table, values)
    populate_list(selected_table)

def remove_record():
    selected_record = records_list.curselection()
    if not selected_record:
        messagebox.showerror('Error', 'Please select a record')
        return
    key = records_list.get(selected_record[0])[0]
    delete_record(selected_table, key)
    populate_list(selected_table)

def update_record_command():
    selected_record = records_list.curselection()
    if not selected_record:
        messagebox.showerror('Error', 'Please select a record')
        return
    key = records_list.get(selected_record[0])[0]
    values = {entry_labels[i]: entry_fields[i].get() for i in range(len(entry_fields))}
    update_record(selected_table, values, key)
    populate_list(selected_table)

def select_record(event):
    try:
        index = records_list.curselection()[0]
        selected_record = records_list.get(index)
        for i in range(len(entry_fields)):
            entry_fields[i].delete(0, tk.END)
            entry_fields[i].insert(tk.END, selected_record[i])
    except IndexError:
        pass

# Create table if it doesn't exist
create_tables()

# Create the main window
root = tk.Tk()
root.title('Student Management System')

# Create labels and entry fields
table_labels = ['Khoa', 'Nganh', 'Lop', 'HocPhan', 'SinhVien', 'DiemHP']
entry_labels = [['MaKhoa', 'TenKhoa'], 
                ['MaNganh', 'TenNganh', 'MaKhoa'], 
                ['MaLop', 'TenLop', 'MaNganh', 'KhoaHoc', 'HeDT', 'NamNhapHoc'], 
                ['MaHP', 'TenHP', 'SoDVHT', 'MaNganh', 'HocKy'], 
                ['MaSinhVien', 'HoTen', 'MaLop', 'GioiTinh', 'NgaySinh', 'DiaChi'], 
                ['MaSinhVien', 'MaHP', 'DiemHP']]
entry_fields = [tk.Entry(root) for _ in range(len(entry_labels[0]))]

# Create table selection dropdown
selected_table = tk.StringVar(root)
selected_table.set(table_labels[0]) # default value
table_dropdown = tk.OptionMenu(root, selected_table, *table_labels)
table_dropdown.grid(row=0, column=0, columnspan=len(entry_fields), sticky='ew')

# Place labels and entry fields on the grid
for i in range(len(entry_labels[0])):
    label = tk.Label(root, text=entry_labels[0][i])
    label.grid(row=1, column=i, sticky='w')
    entry_fields[i].grid(row=2, column=i, sticky='ew', padx=5, pady=5)

# Create buttons
add_button = tk.Button(root, text='Add Record', width=12, command=add_record)
add_button.grid(row=3, column=0, pady=10)

remove_button = tk.Button(root, text='Remove Record', width=12, command=remove_record)
remove_button.grid(row=3, column=1)

update_button = tk.Button(root, text='Update Record', width=12, command=update_record_command)
update_button.grid(row=3, column=2)

# Create listbox to display records
records_list = tk.Listbox(root, height=10, width=100, border=0)
records_list.grid(row=4, column=0, columnspan=len(entry_fields), padx=5, pady=5)
records_list.bind('<<ListboxSelect>>', select_record)

# Populate listbox with records from the selected table
populate_list(selected_table.get())

root.mainloop()
