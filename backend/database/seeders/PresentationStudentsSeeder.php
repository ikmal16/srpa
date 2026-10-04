<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PresentationStudentsSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            ['Ahmad Hakim', 'PRES26001', 'Software Engineering', 'MY', 'Malaysia', 'Malaysia', 'Asia', 'https://flags.restcountries.com/v5/w640/my.png', '2028-05-12'],
            ['Nur Aisyah', 'PRES26002', 'Computer Science', 'MY', 'Malaysia', 'Malaysia', 'Asia', 'https://flags.restcountries.com/v5/w640/my.png', '2026-11-20'],
            ['Muhammad Danish', 'PRES26003', 'Information Technology', 'MY', 'Malaysia', 'Malaysia', 'Asia', 'https://flags.restcountries.com/v5/w640/my.png', '2026-08-15'],
            ['Siti Hajar', 'PRES26004', 'Data Science', 'MY', 'Malaysia', 'Malaysia', 'Asia', 'https://flags.restcountries.com/v5/w640/my.png', '2029-03-18'],
            ['Amirul Hakim', 'PRES26005', 'Software Engineering', 'ID', 'Indonesia', 'Republic of Indonesia', 'Asia', 'https://flags.restcountries.com/v5/w640/id.png', '2027-07-22'],
            ['Puteri Balqis', 'PRES26006', 'Computer Science', 'TH', 'Thailand', 'Kingdom of Thailand', 'Asia', 'https://flags.restcountries.com/v5/w640/th.png', '2026-12-05'],
            ['Mohammad Faris', 'PRES26007', 'Information Technology', 'SG', 'Singapore', 'Republic of Singapore', 'Asia', 'https://flags.restcountries.com/v5/w640/sg.png', '2028-09-14'],
            ['Nur Syafiqah', 'PRES26008', 'Data Science', 'BN', 'Brunei', 'Brunei Darussalam', 'Asia', 'https://flags.restcountries.com/v5/w640/bn.png', '2026-10-25'],
            ['Adam Firdaus', 'PRES26009', 'Software Engineering', 'PK', 'Pakistan', 'Islamic Republic of Pakistan', 'Asia', 'https://flags.restcountries.com/v5/w640/pk.png', '2029-01-30'],
            ['Nur Amirah', 'PRES26010', 'Computer Science', 'BD', 'Bangladesh', "People's Republic of Bangladesh", 'Asia', 'https://flags.restcountries.com/v5/w640/bd.png', '2027-04-16'],

            ['Daniel Tan', 'PRES26011', 'Software Engineering', 'CN', 'China', "People's Republic of China", 'Asia', 'https://flags.restcountries.com/v5/w640/cn.png', '2028-06-21'],
            ['Lim Wei Jian', 'PRES26012', 'Computer Science', 'JP', 'Japan', 'Japan', 'Asia', 'https://flags.restcountries.com/v5/w640/jp.png', '2027-10-09'],
            ['Tan Jia Hui', 'PRES26013', 'Information Technology', 'KR', 'South Korea', 'Republic of Korea', 'Asia', 'https://flags.restcountries.com/v5/w640/kr.png', '2026-11-12'],
            ['Chong Wei Ming', 'PRES26014', 'Data Science', 'VN', 'Vietnam', 'Socialist Republic of Vietnam', 'Asia', 'https://flags.restcountries.com/v5/w640/vn.png', '2029-05-27'],
            ['Nur Izzati', 'PRES26015', 'Software Engineering', 'PH', 'Philippines', 'Republic of the Philippines', 'Asia', 'https://flags.restcountries.com/v5/w640/ph.png', '2028-02-11'],
            ['Hafiz Zulkifli', 'PRES26016', 'Computer Science', 'IN', 'India', 'Republic of India', 'Asia', 'https://flags.restcountries.com/v5/w640/in.png', '2027-08-19'],
            ['Aiman Syahmi', 'PRES26017', 'Information Technology', 'LK', 'Sri Lanka', 'Democratic Socialist Republic of Sri Lanka', 'Asia', 'https://flags.restcountries.com/v5/w640/lk.png', '2026-10-18'],
            ['Sarah Lee', 'PRES26018', 'Data Science', 'AU', 'Australia', 'Commonwealth of Australia', 'Oceania', 'https://flags.restcountries.com/v5/w640/au.png', '2029-07-03'],
            ['Jason Lim', 'PRES26019', 'Software Engineering', 'GB', 'United Kingdom', 'United Kingdom of Great Britain and Northern Ireland', 'Europe', 'https://flags.restcountries.com/v5/w640/gb.png', '2028-11-24'],
            ['Emily Wong', 'PRES26020', 'Computer Science', 'CA', 'Canada', 'Canada', 'Americas', 'https://flags.restcountries.com/v5/w640/ca.png', '2027-05-15'],

            ['Muhammad Arif', 'PRES26021', 'Information Technology', 'MY', 'Malaysia', 'Malaysia', 'Asia', 'https://flags.restcountries.com/v5/w640/my.png', '2026-09-28'],
            ['Nur Farhana', 'PRES26022', 'Data Science', 'MY', 'Malaysia', 'Malaysia', 'Asia', 'https://flags.restcountries.com/v5/w640/my.png', '2028-04-07'],
            ['Syed Danish', 'PRES26023', 'Software Engineering', 'SA', 'Saudi Arabia', 'Kingdom of Saudi Arabia', 'Asia', 'https://flags.restcountries.com/v5/w640/sa.png', '2029-09-12'],
            ['Fatimah Zahra', 'PRES26024', 'Computer Science', 'AE', 'United Arab Emirates', 'United Arab Emirates', 'Asia', 'https://flags.restcountries.com/v5/w640/ae.png', '2027-12-18'],
            ['Irfan Hakimi', 'PRES26025', 'Information Technology', 'TR', 'Turkey', 'Republic of Türkiye', 'Asia', 'https://flags.restcountries.com/v5/w640/tr.png', '2028-08-26'],
            ['Nadia Sofea', 'PRES26026', 'Data Science', 'FR', 'France', 'French Republic', 'Europe', 'https://flags.restcountries.com/v5/w640/fr.png', '2026-10-30'],
            ['Ryan Lee', 'PRES26027', 'Software Engineering', 'US', 'United States', 'United States of America', 'Americas', 'https://flags.restcountries.com/v5/w640/us.png', '2029-02-14'],
            ['Sophia Chen', 'PRES26028', 'Computer Science', 'TW', 'Taiwan', 'Taiwan', 'Asia', 'https://flags.restcountries.com/v5/w640/tw.png', '2027-06-30'],
            ['Akmal Firdaus', 'PRES26029', 'Information Technology', 'MY', 'Malaysia', 'Malaysia', 'Asia', 'https://flags.restcountries.com/v5/w640/my.png', '2028-12-01'],
            ['Nurul Iman', 'PRES26030', 'Data Science', 'MY', 'Malaysia', 'Malaysia', 'Asia', 'https://flags.restcountries.com/v5/w640/my.png', '2027-03-25'],
        ];

        foreach ($students as $student) {
            DB::table('students')->insert([
                'name' => $student[0],
                'matric_no' => $student[1],
                'program' => $student[2],
                'country_code' => $student[3],
                'country_name' => $student[4],
                'official_country_name' => $student[5],
                'region' => $student[6],
                'flag_url' => $student[7],
                'passport_expiry' => $student[8],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}