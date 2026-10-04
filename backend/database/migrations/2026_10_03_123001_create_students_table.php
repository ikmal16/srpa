<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->increments('id');

            $table->string('name', 150);
            $table->string('matric_no', 30)->unique();
            $table->string('program', 150);

            $table->string('country_code', 10);
            $table->string('country_name', 150);
            $table->string('official_country_name', 150);
            $table->string('region', 100);
            $table->string('flag_url', 500)->nullable();

            $table->date('passport_expiry');

            $table->timestamps();

            $table->index('country_code');
            $table->index('region');
            $table->index('passport_expiry');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};