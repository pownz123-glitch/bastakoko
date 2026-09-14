<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    return Student::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
       $student = Student::findorFail($id); 
       $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'birthday' => 'required|date|before:today',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'program' => 'required|string|max:60',
            'gender' => 'required|string|max:60',
            'yr_level' => 'required|integer|min:1|max:4',
        ]);
        $student->update($validated);
        return response()->json($student);
       }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student = student::findfall($id);
        $student->delete();
        return responce()->jspn([
            'message0=>Student succesfully removed.'
        ]);
    }
}