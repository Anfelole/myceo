/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.myceo.app.services.impls;

import com.myceo.app.models.Empresa;
import com.myceo.app.repositories.EmpresaRepository;
import com.myceo.app.services.IEmpresaService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author anfel
 */

@Service
public class EmpresaServiceImpl implements IEmpresaService{

    @Autowired
    private EmpresaRepository empresaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Empresa> findAll() {
        return (List<Empresa>) empresaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Empresa> findAll(org.springframework.data.domain.Pageable pageable) {
        return empresaRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Empresa findById(Integer id) {
        return empresaRepository.findById(id).orElse(null);
    }

    @Override
    public Empresa save(Empresa cliente) {
        return empresaRepository.save(cliente);
    }

    @Override
    public void delete(Integer id) {
        empresaRepository.deleteById(id);
    }
}
