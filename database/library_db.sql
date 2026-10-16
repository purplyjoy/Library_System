-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2026 at 03:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `book_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `author` varchar(100) NOT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `publication_year` int(11) DEFAULT NULL,
  `total_copies` int(11) DEFAULT 1,
  `available_copies` int(11) DEFAULT 1,
  `archived` tinyint(1) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`book_id`, `title`, `author`, `isbn`, `publisher`, `publication_year`, `total_copies`, `available_copies`, `archived`, `category_id`) VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerland', '978-0743273565', 'Charles Scribner\'s Sons', 1925, 6, 4, 1, 48),
(2, 'Clean Code', 'Robert C. Martin', '978-0132350884', 'Prentice Hall', 2008, 4, 2, 0, 21),
(3, 'A Brief History of Time', 'Stephen Hawking', '978-0553380163', 'Bantam Books', 1988, 8, 4, 0, 19),
(4, 'To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'J. B. Lippincott & Co.', 1960, 6, 6, 1, 9),
(6, 'Pride and Prejudice', 'Jane Austen', '978-0547928227', 'T. Egerton', 1813, 4, 2, 0, 8),
(7, 'Still Alice', 'Lisa Genova', '978-1439102817', 'Gallery Books', 2009, 10, 9, 0, 26),
(16, 'The Hobbit', 'J. R. Tolkien', '978-0048230690', 'George Allen & Unwin', 1974, 8, 6, 0, 4),
(17, 'The Catcher in the Rye', 'J.D. Salinger', '978-0316769488', 'Little, Brown and Company', 1951, 5, 5, 0, 1),
(18, 'The Alchemist', 'Paulo Coelho', '978-0061122415', 'HarperOne', 1988, 6, 5, 0, 4),
(19, '1984', 'Geoge Orwell', '978-0451524935', 'Secker & Warburg', 1949, 20, 9, 0, 25),
(20, 'Project Hail Mary', 'Andy Weir', '978-0593135228', 'Ballantine Books', 2021, 10, 9, 0, 3),
(28, 'Educated', 'Tara Westover', '978-0399590528', 'Random House', 2018, 10, 10, 0, 15),
(33, 'Peter Pan', 'James Matthew Barrie', '978-0142437833', 'Penguin Classics', 2004, 10, 10, 0, 4),
(35, 'Atomic Habits', 'James Clear', '978-0735211292', 'Avery Publication', 2018, 10, 10, 0, 32);

-- --------------------------------------------------------

--
-- Table structure for table `borrow_records`
--

CREATE TABLE `borrow_records` (
  `borrow_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `book_id` int(11) NOT NULL,
  `borrow_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `return_date` date DEFAULT NULL,
  `due_date` date NOT NULL,
  `status` enum('borrowed','returned','overdue') DEFAULT 'borrowed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrow_records`
--

INSERT INTO `borrow_records` (`borrow_id`, `name`, `email`, `address`, `book_id`, `borrow_date`, `return_date`, `due_date`, `status`) VALUES
(1, 'Juan Dela Cruz', 'juan@gmail.com', 'Nabonton, Ligao City', 1, '2026-05-15 16:00:00', '2026-05-20', '2026-05-20', 'returned'),
(2, 'Ana Lopez', 'ana@gmail.com', 'Calzada, Ligao City', 4, '2026-05-17 16:00:00', '2026-05-26', '2026-05-21', 'returned'),
(3, 'Maria Santos', 'maria@gmail.com', 'Sta. Cruz, Ligao City', 3, '2026-05-21 16:00:00', '2026-05-22', '2026-05-25', 'returned'),
(4, 'Ian Cruz', 'ian@gmail.com', 'San Vicente, Ligao City', 2, '2026-05-22 13:08:33', '2026-05-24', '2026-05-22', 'returned'),
(5, 'Sofia Smith', 'fyangie@gmail.com', 'Ligao City', 6, '2026-05-22 13:12:59', NULL, '2026-05-24', 'overdue'),
(6, 'Choi Hyunwook', 'choiii@gmail.com', 'Ligao City', 7, '2026-05-22 13:16:50', '2026-05-23', '2026-05-27', 'returned'),
(7, 'John Reyes', 'john@gmail.com', 'Ligao City', 7, '2026-05-22 13:27:35', NULL, '2026-05-24', 'overdue'),
(8, 'Kevin Ramos', 'kevin@gmail.com', 'Ligao City', 16, '2026-05-22 13:56:58', NULL, '2026-05-26', 'borrowed'),
(9, 'Grace Ann', 'grace@gmail.com', 'Ligao City', 19, '2026-05-22 13:59:53', NULL, '2026-05-25', 'overdue'),
(10, 'Carlos Villanueva', 'carloss@gmail.com', 'Tastas, Ligao City', 20, '2026-05-23 05:20:15', NULL, '2026-05-26', 'borrowed'),
(11, 'Mark Garcia', 'mark@gmail.com', 'Ligao City', 20, '2026-05-23 05:21:53', '2026-05-26', '2026-05-27', 'returned'),
(12, 'Andie Cruz', 'andiee@gmail.com', 'Sta. Cruz, Ligao City', 16, '2026-05-23 05:24:50', NULL, '2026-05-23', 'overdue'),
(13, 'Shaina Torres', 'shainaa@gmail.com', 'Sta. Cruz, Ligao City', 17, '2026-05-23 05:27:34', '2026-05-25', '2026-05-25', 'returned'),
(14, 'Noah Ramirez', 'noah@gmail.com', 'Ligao City', 7, '2026-05-26 08:37:03', '2026-05-26', '2026-05-30', 'returned'),
(15, 'Tom Shelby', 'tomshelby@gmail.com', 'Sta. Cruz, Ligao City', 2, '2026-05-26 10:12:47', NULL, '2026-05-31', 'borrowed');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category`) VALUES
(1, 'Fiction'),
(2, 'Non-Fiction'),
(3, 'Science Fiction'),
(4, 'Fantasy'),
(5, 'Mystery'),
(6, 'Thriller'),
(7, 'Horror'),
(8, 'Romance'),
(9, 'Historical Fiction'),
(10, 'Adventure'),
(11, 'Drama'),
(12, 'Young Adult'),
(13, 'Biography'),
(14, 'Autobiography'),
(15, 'Memoir'),
(16, 'History'),
(17, 'Philosophy'),
(18, 'Self-Help'),
(19, 'Science'),
(20, 'Mathematics'),
(21, 'Technology'),
(22, 'Business'),
(23, 'Economics'),
(24, 'Language'),
(25, 'Dystopian'),
(26, 'Contemporary'),
(27, 'Art'),
(28, 'Children\'s'),
(29, 'Classic'),
(30, 'Comics & Graphic Novels'),
(31, 'Poetry'),
(32, 'Psychology'),
(33, 'Adult Fiction'),
(34, 'Alternate Universe'),
(35, 'Artificial Intelligence'),
(36, 'Astrology'),
(37, 'Astronomy'),
(38, 'Audiobook'),
(39, 'Biology'),
(40, 'Psychological'),
(41, 'Romantic Comedy'),
(42, 'Geography'),
(43, 'Law'),
(44, 'Literary'),
(45, 'Medical'),
(46, 'Political Science'),
(47, 'Social Science'),
(48, 'Literary Fiction');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`book_id`),
  ADD UNIQUE KEY `isbn` (`isbn`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `borrow_records`
--
ALTER TABLE `borrow_records`
  ADD PRIMARY KEY (`borrow_id`),
  ADD KEY `idx_book` (`book_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `borrow_records`
--
ALTER TABLE `borrow_records`
  MODIFY `borrow_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `borrow_records`
--
ALTER TABLE `borrow_records`
  ADD CONSTRAINT `borrow_records_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */; 